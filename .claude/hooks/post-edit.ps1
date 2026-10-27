# PostToolUse hook —— 编辑后自动校验
# mode: tsc-watch（读后台常驻 tsc --watch 日志）/ node-check（node --check）/ none
# 关键：stdin 必须按字节读取再 UTF-8 解码，否则中文路径会被系统代码页(936)搞乱
$ErrorActionPreference = 'Continue'
[Console]::OutputEncoding = [Text.Encoding]::UTF8
if ($env:CLAUDE_HOOKS_DISABLED -eq '1') { exit 0 }

function Read-StdinUtf8 {
    try {
        $sin = [Console]::OpenStandardInput()
        $ms  = New-Object System.IO.MemoryStream
        $sin.CopyTo($ms)
        $bytes = $ms.ToArray()
        if (-not $bytes -or $bytes.Length -eq 0) { return '' }
        return [Text.Encoding]::UTF8.GetString($bytes)
    } catch { return '' }
}

$raw = Read-StdinUtf8
if (-not $raw) { exit 0 }
try { $d = $raw | ConvertFrom-Json } catch { exit 0 }

$file = $d.tool_input.file_path
if (-not $file) { exit 0 }
$file = [IO.Path]::GetFullPath($file)
if (-not (Test-Path -LiteralPath $file)) { exit 0 }
if ($file -match '\\(node_modules|\.git|\.next|\.vinext|dist|build|bin|obj|coverage|\.wrangler|__pycache__|\.venv)\\') { exit 0 }

$root    = (Get-Location).Path
$cfgPath = Join-Path $root '.claude\hooks.config.json'
if (-not (Test-Path $cfgPath)) { exit 0 }
$cfg = [IO.File]::ReadAllText($cfgPath, [Text.Encoding]::UTF8) | ConvertFrom-Json
$pe  = $cfg.postEdit
if (-not $pe -or $pe.enabled -eq $false) { exit 0 }

$ext = [IO.Path]::GetExtension($file).ToLower()
if ($pe.extensions -and ($pe.extensions -notcontains $ext)) { exit 0 }

$mode = if ($pe.mode) { $pe.mode } else { 'none' }
$leaf = [IO.Path]::GetFileName($file)

function Read-Shared($path) {
    # 守护进程的 stdout 重定向独占了日志，必须以 FileShare.ReadWrite 打开
    try {
        $fs = [IO.File]::Open($path, [IO.FileMode]::Open, [IO.FileAccess]::Read, [IO.FileShare]::ReadWrite)
        $sr = New-Object IO.StreamReader($fs, [Text.Encoding]::UTF8)
        $txt = $sr.ReadToEnd(); $sr.Dispose(); $fs.Dispose()
        return $txt
    } catch { return '' }
}

function Report($msg) {
    $mark = Join-Path $root '.claude\.hook-state'
    $sig  = [BitConverter]::ToString(
              [Security.Cryptography.SHA1]::Create().ComputeHash(
                [Text.Encoding]::UTF8.GetBytes($msg))).Replace('-','').Substring(0,16)
    $prev = if (Test-Path $mark) { [IO.File]::ReadAllText($mark, [Text.Encoding]::UTF8).Trim() } else { '' }
    if ($prev -eq $sig) {
        [Console]::Error.WriteLine('[hook] 同一错误已出现两次，停止自动修复。')
        [Console]::Error.WriteLine('[hook] 请停下来向用户说明这个错误，不要继续尝试。')
        exit 0
    }
    [IO.File]::WriteAllText($mark, $sig, (New-Object Text.UTF8Encoding $false))
    [Console]::Error.WriteLine('===== 自动校验失败（仅本次文件相关） =====')
    [Console]::Error.WriteLine($msg)
    [Console]::Error.WriteLine('==========================================')
    [Console]::Error.WriteLine('必须修复以上错误再继续。不要改与本次任务无关的文件。')
    exit 2
}

switch ($mode) {

    'node-check' {
        if (-not (Get-Command node -ErrorAction SilentlyContinue)) { exit 0 }
        $out = & cmd /c "node --check `"$file`" 2>&1" | Out-String
        if ($LASTEXITCODE -ne 0) {
            Report ("【语法错误】" + $leaf + "`n" + (($out -split "`r?`n" | Select-Object -First 20) -join "`n"))
        }
        exit 0
    }

    'tsc-watch' {
        $logRel  = if ($pe.log) { $pe.log } else { '.claude/.typecheck.log' }
        $log     = Join-Path $root ($logRel -replace '/', '\')
        $pidFile = "$log.pid"
        $wait    = if ($pe.waitSeconds) { [int]$pe.waitSeconds } else { 12 }

        # 守护进程是否在跑
        $alive = $false
        if (Test-Path $pidFile) {
            $oldPid = ([IO.File]::ReadAllText($pidFile, [Text.Encoding]::UTF8)).Trim()
            if ($oldPid -and (Get-Process -Id $oldPid -ErrorAction SilentlyContinue)) { $alive = $true }
        }
        if (-not $alive) {
            $watchCmd = if ($pe.watchCommand) { $pe.watchCommand } else { 'npx tsc -p tsconfig.json --noEmit --watch --pretty false' }
            $dir = Split-Path $log -Parent
            if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
            $p = Start-Process -FilePath 'cmd.exe' `
                   -ArgumentList "/c $watchCmd > `"$log`" 2>&1" `
                   -WindowStyle Hidden -PassThru
            [IO.File]::WriteAllText($pidFile, "$($p.Id)", (New-Object Text.UTF8Encoding $false))
            exit 0   # 首次启动要预热，本次不阻塞
        }

        # 等日志刷新
        $startUtc = (Get-Date).ToUniversalTime()
        $deadline = (Get-Date).AddSeconds($wait)
        $before   = if (Test-Path $log) { (Get-Item $log).LastWriteTimeUtc } else { [datetime]::MinValue }
        while ((Get-Date) -lt $deadline) {
            Start-Sleep -Milliseconds 300
            if ((Test-Path $log) -and ((Get-Item $log).LastWriteTimeUtc -gt $before)) { break }
        }
        if (-not (Test-Path $log)) { exit 0 }

        $lines = (Read-Shared $log) -split "`r?`n"
        $lastFound = ($lines | Where-Object { $_ -match 'Found \d+ error' } | Select-Object -Last 1)
        if ($lastFound -and $lastFound -notmatch 'Found 0 error') {
            $hits = $lines | Where-Object {
                $_ -match '\(\d+,\d+\):\s*error\s+TS' -and $_ -match [regex]::Escape($leaf)
            }
            if ($hits) {
                $hits = $hits | Select-Object -Unique
                Report ("【TypeScript】`n" + (($hits | Select-Object -First 40) -join "`n"))
            }
        }
        exit 0
    }

    default { exit 0 }
}