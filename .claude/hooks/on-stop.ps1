# Stop hook —— 清防死循环标记 + 提示音（不做重活，全量校验交给 /check）
$ErrorActionPreference = 'Continue'
if ($env:CLAUDE_HOOKS_DISABLED -eq '1') { exit 0 }
try {
    $sin = [Console]::OpenStandardInput()
    $ms  = New-Object System.IO.MemoryStream
    $sin.CopyTo($ms)
    $null = $ms.ToArray()
} catch {}

$root = (Get-Location).Path
Remove-Item (Join-Path $root '.claude\.hook-state') -ErrorAction SilentlyContinue

$notify = $true
$cfgPath = Join-Path $root '.claude\hooks.config.json'
if (Test-Path $cfgPath) {
    try {
        $cfg = [IO.File]::ReadAllText($cfgPath, [Text.Encoding]::UTF8) | ConvertFrom-Json
        if ($cfg.onStop -and $cfg.onStop.notify -eq $false) { $notify = $false }
    } catch {}
}
if ($notify) { try { [console]::beep(880,120); [console]::beep(1180,120) } catch {} }
exit 0