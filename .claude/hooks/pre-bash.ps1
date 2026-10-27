# PreToolUse hook —— 拦截危险 Bash 命令
$ErrorActionPreference = 'Continue'
[Console]::OutputEncoding = [Text.Encoding]::UTF8
if ($env:CLAUDE_HOOKS_DISABLED -eq '1') { exit 0 }

try {
    $sin = [Console]::OpenStandardInput()
    $ms  = New-Object System.IO.MemoryStream
    $sin.CopyTo($ms)
    $raw = [Text.Encoding]::UTF8.GetString($ms.ToArray())
} catch { exit 0 }
if (-not $raw) { exit 0 }
try { $d = $raw | ConvertFrom-Json } catch { exit 0 }

$cmd = $d.tool_input.command
if (-not $cmd) { exit 0 }

$rules = @(
  @{ p = 'rm\s+-[a-zA-Z]*[rR][a-zA-Z]*f[a-zA-Z]*\s+(/|~|\$HOME|\.\.)'; r = '禁止递归删除根目录/家目录' },
  @{ p = 'git\s+push\s+.*(--force\b|--force-with-lease|-f\s)';         r = '禁止 force push' },
  @{ p = 'git\s+reset\s+--hard';                                        r = '禁止 git reset --hard，会丢失工作区改动' },
  @{ p = 'git\s+clean\s+-[a-zA-Z]*f';                                   r = '禁止 git clean -f，会删除未跟踪文件' },
  @{ p = '>\s*\.env(\.|\s|$)';                                          r = '禁止覆盖 .env 文件' },
  @{ p = '(curl|wget|iwr|Invoke-WebRequest)[^|]*\|\s*(ba|z)?sh';        r = '禁止 curl | sh 远程执行' },
  @{ p = '\b(DROP\s+(TABLE|DATABASE)|TRUNCATE\s+TABLE)\b';              r = '禁止破坏性 DDL' },
  @{ p = 'chmod\s+777';                                                 r = '禁止 777 权限' },
  @{ p = '(npm|pnpm|yarn)\s+publish';                                   r = '禁止自动发布包' },
  @{ p = 'wrangler\s+delete';                                           r = '禁止删除 Cloudflare 资源' }
)

foreach ($r in $rules) {
  if ($cmd -match $r.p) {
    [Console]::Error.WriteLine("[guard] 已拦截：$($r.r)")
    [Console]::Error.WriteLine("[guard] 命中规则：$($r.p)")
    [Console]::Error.WriteLine("[guard] 如确需执行，先向用户说明风险，由用户手动执行。")
    exit 2
  }
}
exit 0