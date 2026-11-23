$ErrorActionPreference = "Stop"
$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Import-Module (Join-Path $PSScriptRoot "local-production-runtime.psm1")

$lock = Enter-CustardLocalServerLock -RepositoryRoot $repositoryRoot
try {
  $processes = @(Get-CustardRuntimeProcesses)
  $servers = @($processes | Where-Object { Get-CustardServerKind -Process $_ -RepositoryRoot $repositoryRoot })
  foreach ($server in $servers) {
    $serverParent = $servers | Where-Object {
      $_.ProcessId -eq $server.ParentProcessId -and $_.CreationDate -le $server.CreationDate
    }
    if ($serverParent) {
      continue
    }
    Stop-CustardRuntimeTree -RootProcess $server -Processes $processes
    $kind = Get-CustardServerKind -Process $server -RepositoryRoot $repositoryRoot
    Write-Output "Stopped local $kind process $($server.ProcessId)."
  }

  $runtimeRoot = Join-Path $repositoryRoot "output\local-production"
  Remove-Item -LiteralPath (Join-Path $runtimeRoot "production-server.pid"), (Join-Path $runtimeRoot "production-server.port") -Force -ErrorAction SilentlyContinue
} finally {
  $lock.ReleaseMutex()
  $lock.Dispose()
}
