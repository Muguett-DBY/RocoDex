param(
  [int]$Port = 3200
)

$ErrorActionPreference = "Stop"
$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$staticIndex = Join-Path $repositoryRoot "out\index.html"

if (-not (Test-Path -LiteralPath $staticIndex)) {
  throw "Missing production build. Run npm run build first."
}

while (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue) {
  $Port += 1
}

$node = Get-Command node -ErrorAction Stop
$nextCli = Join-Path $repositoryRoot "node_modules\wrangler\bin\wrangler.js"
$logRoot = Join-Path $repositoryRoot "output\local-production"
New-Item -ItemType Directory -Force -Path $logRoot | Out-Null
$stdout = Join-Path $logRoot "local-production-$Port.stdout.log"
$stderr = Join-Path $logRoot "local-production-$Port.stderr.log"
$baseUrl = "http://127.0.0.1:$Port"


$process = Start-Process `
  -FilePath $node.Source `
  -ArgumentList @($nextCli, "dev", "--ip", "127.0.0.1", "--port", "$Port") `
  -WorkingDirectory $repositoryRoot `
  -WindowStyle Hidden `
  -RedirectStandardOutput $stdout `
  -RedirectStandardError $stderr `
  -PassThru

$deadline = (Get-Date).AddSeconds(60)
$ready = $false
do {
  Start-Sleep -Milliseconds 500
  try {
    $response = Invoke-WebRequest -UseBasicParsing "$baseUrl/" -TimeoutSec 2
    $ready = $response.StatusCode -eq 200
  } catch {
    $ready = $false
  }
} until ($ready -or $process.HasExited -or (Get-Date) -gt $deadline)

if (-not $ready) {
  if (-not $process.HasExited) {
    Stop-Process -Id $process.Id
  }
  Get-Content -LiteralPath $stdout -ErrorAction SilentlyContinue
  Get-Content -LiteralPath $stderr -ErrorAction SilentlyContinue
  throw "Local production server failed to start on port $Port."
}

Set-Content -LiteralPath (Join-Path $logRoot "production-server.pid") -Value $process.Id
Set-Content -LiteralPath (Join-Path $logRoot "production-server.port") -Value $Port

Write-Output "Local production server: $baseUrl/"
Write-Output "PID: $($process.Id)"
Write-Output "Logs: $stdout | $stderr"
