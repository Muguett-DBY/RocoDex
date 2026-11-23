param(
  [ValidateRange(1, 65535)]
  [int]$Port = 3200
)

$ErrorActionPreference = "Stop"
$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Import-Module (Join-Path $PSScriptRoot "local-production-runtime.psm1")

$staticStatus = Join-Path $repositoryRoot "out\status.json"
if (-not (Test-Path -LiteralPath $staticStatus -PathType Leaf)) {
  throw "Missing production build. Run npm run build first."
}

$node = Get-Command node.exe -CommandType Application | Select-Object -First 1
$wranglerCli = Join-Path $repositoryRoot "node_modules\wrangler\bin\wrangler.js"
if (-not (Test-Path -LiteralPath $wranglerCli -PathType Leaf)) {
  throw "Missing Wrangler. Run npm ci first."
}

$lock = Enter-CustardLocalServerLock -RepositoryRoot $repositoryRoot
try {
  $logRoot = Join-Path $repositoryRoot "output\local-production"
  $pidPath = Join-Path $logRoot "production-server.pid"
  $portPath = Join-Path $logRoot "production-server.port"
  New-Item -ItemType Directory -Force -Path $logRoot | Out-Null

  $savedPid = 0
  if ([int]::TryParse((Get-Content -LiteralPath $pidPath -Raw -ErrorAction SilentlyContinue), [ref]$savedPid) -and $savedPid -gt 0) {
    $existing = Get-CimInstance -ClassName Win32_Process -Filter "ProcessId = $savedPid"
    if ($existing -and (Get-CustardServerKind -Process $existing -RepositoryRoot $repositoryRoot) -eq "Wrangler") {
      throw "A background preview is already running for this checkout. Run npm run stop:local before starting another."
    }
  }
  Remove-Item -LiteralPath $pidPath, $portPath -Force -ErrorAction SilentlyContinue

  while (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue) {
    if ($Port -eq 65535) {
      throw "No preview port is available from the requested port through 65535."
    }
    $Port += 1
  }

  $stdout = Join-Path $logRoot "local-production-$Port.stdout.log"
  $stderr = Join-Path $logRoot "local-production-$Port.stderr.log"
  $baseUrl = "http://127.0.0.1:$Port"
  $arguments = '"{0}" dev --ip 127.0.0.1 --port {1}' -f $wranglerCli, $Port

  $startup = @{
    FilePath = $node.Source
    ArgumentList = $arguments
    WorkingDirectory = $repositoryRoot
    WindowStyle = "Hidden"
    RedirectStandardOutput = $stdout
    RedirectStandardError = $stderr
    PassThru = $true
  }
  $process = Start-Process @startup

  $deadline = (Get-Date).AddSeconds(60)
  $ready = $false
  try {
    do {
      Start-Sleep -Milliseconds 500
      try {
        $response = Invoke-WebRequest -UseBasicParsing "$baseUrl/status.json" -TimeoutSec 2
      } catch {
        continue
      }
      if ($response.StatusCode -eq 200) {
        $allProcesses = @(Get-CustardRuntimeProcesses)
        $server = $allProcesses | Where-Object ProcessId -eq $process.Id
        if ($server -and (Get-CustardServerKind -Process $server -RepositoryRoot $repositoryRoot) -eq "Wrangler") {
          $ownedIds = @(Get-CustardRuntimeTree -RootProcess $server -Processes $allProcesses | ForEach-Object ProcessId)
          $ready = [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
            Where-Object { $_.OwningProcess -in $ownedIds })
        }
      }
    } until ($ready -or $process.HasExited -or (Get-Date) -gt $deadline)

    if (-not $ready) {
      throw "Local production server failed on port $Port. See $stdout and $stderr."
    }

    Set-Content -LiteralPath $pidPath -Value $process.Id -Encoding ascii
    Set-Content -LiteralPath $portPath -Value $Port -Encoding ascii
  } catch {
    $allProcesses = @(Get-CustardRuntimeProcesses)
    $server = $allProcesses | Where-Object ProcessId -eq $process.Id
    if ($server -and (Get-CustardServerKind -Process $server -RepositoryRoot $repositoryRoot) -eq "Wrangler") {
      Stop-CustardRuntimeTree -RootProcess $server -Processes $allProcesses
    }
    Remove-Item -LiteralPath $pidPath, $portPath -Force -ErrorAction SilentlyContinue
    throw
  }

  Write-Output "Local production server is ready at $baseUrl/"
  Write-Output "Process $($process.Id). Logs are in $logRoot."
} finally {
  $lock.ReleaseMutex()
  $lock.Dispose()
}
