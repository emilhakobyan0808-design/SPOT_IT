param([string]$ProjectPath = '')
# Windows PowerShell 5.1 compatible. No global execution-policy changes or admin rights.
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$installRoot = if ($env:SPOT_IT_HOME) { $env:SPOT_IT_HOME } else { Join-Path $env:LOCALAPPDATA 'SPOT IT' }
if (-not $installRoot) { throw 'A user-local installation folder could not be determined.' }
[IO.Directory]::CreateDirectory($installRoot) | Out-Null
$lock = $null
$tempDir = $null
$script:NodeCheckError = ''
function Test-Node([string]$Path) {
 $script:NodeCheckError = ''
 try {
  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) { $script:NodeCheckError = 'node.exe was not found at ' + $Path; return $false }
  # Windows PowerShell 5.1 can strip embedded quotes from native -e arguments.
  # Use a simple native --version argument, with no JavaScript to quote.
  $start = New-Object System.Diagnostics.ProcessStartInfo
  $start.FileName = $Path
  $start.Arguments = '--version'
  $start.UseShellExecute = $false
  $start.CreateNoWindow = $true
  $start.RedirectStandardOutput = $true
  $start.RedirectStandardError = $true
  $process = New-Object System.Diagnostics.Process
  $process.StartInfo = $start
  try {
   [void]$process.Start()
   $output = $process.StandardOutput.ReadToEnd().Trim()
   $errorOutput = $process.StandardError.ReadToEnd().Trim()
   $process.WaitForExit()
   if ($process.ExitCode -ne 0) { $script:NodeCheckError = 'node.exe exited with code ' + $process.ExitCode + ': ' + $errorOutput; return $false }
   if ($output -notmatch '^v(\d+)\.(\d+)\.(\d+)$') { $script:NodeCheckError = 'Unexpected Node.js version output: ' + $output; return $false }
   $major = [int]$Matches[1]
   $minor = [int]$Matches[2]
   if ($major -lt 22 -or ($major -eq 22 -and $minor -lt 13)) { $script:NodeCheckError = 'Node.js ' + $output + ' is too old; version 22.13 or later is required.'; return $false }
   return $true
  } finally { $process.Dispose() }
 } catch { $script:NodeCheckError = $_.Exception.Message; return $false }
}
function Get-Download([string]$Url,[string]$Destination) {
 $previousProgress = $ProgressPreference
 $ProgressPreference = 'SilentlyContinue'
 try { Invoke-WebRequest -UseBasicParsing -Uri $Url -OutFile $Destination } finally { $ProgressPreference = $previousProgress }
}
try {
 try { $lock = [IO.File]::Open((Join-Path $installRoot 'bootstrap.lock'),[IO.FileMode]::OpenOrCreate,[IO.FileAccess]::ReadWrite,[IO.FileShare]::None) } catch { Write-Host 'SPOT IT setup is already running in another window.'; return }
 $nodeBinary = $null
 $npmCli = $null
 $systemNode = Get-Command node.exe -ErrorAction SilentlyContinue
 $systemNpm = Get-Command npm.cmd -ErrorAction SilentlyContinue
 $privateNode = Join-Path $installRoot 'runtime\node.exe'
 if ($env:SPOT_IT_FORCE_RUNTIME -ne '1' -and $systemNode -and $systemNpm -and (Test-Node $systemNode.Source)) { $nodeBinary = $systemNode.Source }
 elseif ((Test-Path $privateNode) -and (Test-Node $privateNode)) { $nodeBinary = $privateNode; $npmCli = Join-Path $installRoot 'runtime\node_modules\npm\bin\npm-cli.js' }
 else {
  $architecture = if ($env:PROCESSOR_ARCHITEW6432) { $env:PROCESSOR_ARCHITEW6432 } else { $env:PROCESSOR_ARCHITECTURE }
  $arch = switch ($architecture.ToUpperInvariant()) { 'ARM64' { 'arm64' } 'AMD64' { 'x64' } default { throw 'This launcher requires a 64-bit Intel/AMD or ARM Windows computer.' } }
  Write-Host ('Installing a private Node.js runtime for SPOT IT (' + $arch + '). Your system installation will not be changed.')
  $tempDir = Join-Path $installRoot ('.setup-' + [guid]::NewGuid().ToString('N'))
  [IO.Directory]::CreateDirectory($tempDir) | Out-Null
  $manifest = Join-Path $tempDir 'SHASUMS256.txt'
  Get-Download 'https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt' $manifest
  $pattern = '^([a-f0-9]{64})\s+(node-v24\.\d+\.\d+-win-' + $arch + '\.zip)$'
  $match = Get-Content $manifest | Where-Object { $_ -match $pattern } | Select-Object -First 1
  if (-not $match -or -not ($match -match $pattern)) { throw 'Could not locate the official Node.js archive.' }
  $expected = $Matches[1]
  $archiveName = $Matches[2]
  $archive = Join-Path $tempDir $archiveName
  Get-Download ('https://nodejs.org/dist/latest-v24.x/' + $archiveName) $archive
  $actual = (Get-FileHash -Path $archive -Algorithm SHA256).Hash.ToLowerInvariant()
  if ($actual -ne $expected) { throw 'Node.js download failed its checksum check. Nothing was installed.' }
  $unpacked = Join-Path $tempDir 'unpacked'
  Expand-Archive -LiteralPath $archive -DestinationPath $unpacked
  $downloaded = Join-Path $unpacked ($archiveName -replace '\.zip$','')
  if (-not (Test-Node (Join-Path $downloaded 'node.exe'))) { throw ('The downloaded Node.js runtime could not be verified. ' + $script:NodeCheckError) }
  $runtime = Join-Path $installRoot 'runtime'
  if (Test-Path $runtime) { Move-Item -LiteralPath $runtime -Destination (Join-Path $tempDir 'old-runtime') }
  Move-Item -LiteralPath $downloaded -Destination $runtime
  $nodeBinary = Join-Path $runtime 'node.exe'
  $npmCli = Join-Path $runtime 'node_modules\npm\bin\npm-cli.js'
 }
 $env:PATH = (Split-Path $nodeBinary) + ';' + $env:PATH
 if ($npmCli) { $env:SPOT_IT_NPM_CLI = $npmCli }
 if (-not $ProjectPath) {
  $ProjectPath = Join-Path $installRoot 'app'
  if (-not (Test-Path (Join-Path $ProjectPath 'scripts\launch.mjs')) -or -not (Test-Path (Join-Path $ProjectPath 'package-lock.json'))) {
   Write-Host 'Downloading the SPOT IT project from GitHub.'
   if (-not $tempDir) { $tempDir = Join-Path $installRoot ('.setup-' + [guid]::NewGuid().ToString('N')); [IO.Directory]::CreateDirectory($tempDir) | Out-Null }
   $archive = Join-Path $tempDir 'app.zip'
   Get-Download 'https://github.com/emilhakobyan0808-design/SPOT_IT/archive/refs/heads/main.zip' $archive
   $unpacked = Join-Path $tempDir 'project'
   Expand-Archive -LiteralPath $archive -DestinationPath $unpacked
   $sourcePath = Join-Path $unpacked 'SPOT_IT-main'
   if (-not (Test-Path (Join-Path $sourcePath 'scripts\launch.mjs')) -or -not (Test-Path (Join-Path $sourcePath 'package-lock.json'))) { throw 'The downloaded project is incomplete.' }
   if (Test-Path $ProjectPath) { throw 'An incomplete app folder already exists. Keep its data folder and ask for help before replacing it.' }
   Move-Item -LiteralPath $sourcePath -Destination $ProjectPath
  }
  Copy-Item -LiteralPath (Join-Path $ProjectPath 'scripts\bootstrap.ps1') -Destination (Join-Path $installRoot 'bootstrap.ps1') -Force
  $startText = '@echo off' + "`r`n" + 'set "SPOT_IT_BOOTSTRAP=%~dp0bootstrap.ps1"' + "`r`n" + 'set "SPOT_IT_PROJECT=%~dp0app"' + "`r`n" + 'powershell -NoProfile -Command "& ([scriptblock]::Create([IO.File]::ReadAllText($env:SPOT_IT_BOOTSTRAP))) -ProjectPath $env:SPOT_IT_PROJECT"' + "`r`n" + 'pause' + "`r`n"
  [IO.File]::WriteAllText((Join-Path $installRoot 'start.cmd'),$startText,[Text.Encoding]::ASCII)
 }
 $launcher = Join-Path $ProjectPath 'scripts\launch.mjs'
 if (-not (Test-Path $launcher)) { throw 'Choose the project folder containing scripts/launch.mjs.' }
 $lock.Dispose(); $lock = $null
 if ($tempDir -and (Test-Path $tempDir)) { Remove-Item -LiteralPath $tempDir -Recurse -Force; $tempDir = $null }
 & $nodeBinary $launcher
 if ($LASTEXITCODE -ne 0) { throw 'SPOT IT did not start. Check the message above and run the launcher again.' }
} catch { Write-Host ('SPOT IT setup failed: ' + $_.Exception.Message) -ForegroundColor Red; throw }
finally { if ($lock) { $lock.Dispose() }; if ($tempDir -and (Test-Path $tempDir)) { Remove-Item -LiteralPath $tempDir -Recurse -Force } }
