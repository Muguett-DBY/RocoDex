$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$escapedRepoRoot = $repoRoot.Replace("\", "\\")
$runtimeRoot = Join-Path $repoRoot "output\local-production"

$processes = Get-CimInstance Win32_Process -Filter "name = 'node.exe'" |
  Where-Object {
    $_.CommandLine -and
    $_.CommandLine -like "*next*" -and
    $_.CommandLine -like "*$repoRoot*"
  }

foreach ($process in $processes) {
  Stop-Process -Id $process.ProcessId -Force -ErrorAction SilentlyContinue
  Write-Host "Stopped local Next process $($process.ProcessId) for $escapedRepoRoot"
}

Remove-Item -LiteralPath (Join-Path $runtimeRoot "production-server.pid") -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath (Join-Path $runtimeRoot "production-server.port") -Force -ErrorAction SilentlyContinue
