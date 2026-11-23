function Enter-CustardLocalServerLock {
  param([string]$RepositoryRoot)

  $sha256 = [Security.Cryptography.SHA256]::Create()
  try {
    $rootBytes = [Text.Encoding]::UTF8.GetBytes($RepositoryRoot.ToUpperInvariant())
    $mutexId = [BitConverter]::ToString($sha256.ComputeHash($rootBytes)).Replace("-", "")
  } finally {
    $sha256.Dispose()
  }

  $mutex = [Threading.Mutex]::new($false, "Local\CustardLocalServer-$mutexId")
  try {
    if (-not $mutex.WaitOne([TimeSpan]::FromSeconds(75))) {
      $mutex.Dispose()
      throw "Another local server operation is still running."
    }
  } catch [Threading.AbandonedMutexException] {
    # An interrupted caller left the mutex free. The current caller owns it.
  }
  return $mutex
}

function Get-CustardRuntimeProcesses {
  Get-CimInstance -ClassName Win32_Process -Filter "Name = 'node.exe' OR Name = 'workerd.exe'"
}

function Get-CustardServerKind {
  param($Process, [string]$RepositoryRoot)

  if ($Process.Name -ne "node.exe" -or $Process.CommandLine -notmatch '^\s*(?:"[^"]+"|\S+)(?:\s+--no-warnings)*\s+(?:"(?<cli>[^"]+)"|(?<cli>\S+))\s+dev(?:\s|$)') {
    return
  }

  $cli = $Matches["cli"]
  if ($cli -notmatch '^(?:[A-Za-z]:[\\/]|\\\\)') {
    return
  }

  try {
    $cliPath = [IO.Path]::GetFullPath($cli)
  } catch [ArgumentException] {
    return
  } catch [NotSupportedException] {
    return
  }
  if ($cliPath -eq (Join-Path $RepositoryRoot "node_modules\wrangler\bin\wrangler.js") -or
      $cliPath -eq (Join-Path $RepositoryRoot "node_modules\wrangler\wrangler-dist\cli.js")) {
    return "Wrangler"
  }
  if ($cliPath -eq (Join-Path $RepositoryRoot "node_modules\next\dist\bin\next")) {
    return "Next.js"
  }
}

function Get-CustardRuntimeTree {
  param($RootProcess, [object[]]$Processes)

  $children = $Processes | Where-Object {
    $_.ParentProcessId -eq $RootProcess.ProcessId -and
    $_.ProcessId -ne $RootProcess.ProcessId -and
    $_.CreationDate -ge $RootProcess.CreationDate
  }
  foreach ($child in $children) {
    Get-CustardRuntimeTree -RootProcess $child -Processes $Processes
  }
  $RootProcess
}

function Stop-CustardRuntimeTree {
  param($RootProcess, [object[]]$Processes)

  foreach ($process in Get-CustardRuntimeTree -RootProcess $RootProcess -Processes $Processes) {
    $current = Get-CimInstance -ClassName Win32_Process -Filter "ProcessId = $($process.ProcessId)"
    if ($current -and $current.Name -eq $process.Name -and $current.CreationDate -eq $process.CreationDate) {
      try {
        Stop-Process -Id $process.ProcessId -ErrorAction Stop
      } catch {
        $remaining = Get-CimInstance -ClassName Win32_Process -Filter "ProcessId = $($process.ProcessId)"
        if ($remaining -and $remaining.CreationDate -eq $process.CreationDate) {
          throw
        }
      }
    }
  }
}

Export-ModuleMember -Function Enter-CustardLocalServerLock, Get-CustardRuntimeProcesses, Get-CustardServerKind, Get-CustardRuntimeTree, Stop-CustardRuntimeTree
