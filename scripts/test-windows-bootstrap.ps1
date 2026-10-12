# Integration test for Windows PowerShell 5.1 and the actual official Node binary.
$ErrorActionPreference = 'Stop'
$folder = Join-Path ([IO.Path]::GetTempPath()) ('spot-bootstrap-test-' + [guid]::NewGuid().ToString('N'))
$project = Join-Path $folder 'project with spaces'
$install = Join-Path $folder 'private runtime'
$oldHome = $env:SPOT_IT_HOME
$oldForce = $env:SPOT_IT_FORCE_RUNTIME
try {
 [IO.Directory]::CreateDirectory((Join-Path $project 'scripts')) | Out-Null
 [IO.File]::WriteAllText((Join-Path $project 'scripts\launch.mjs'),"console.log('WINDOWS_BOOTSTRAP_OK');",[Text.Encoding]::ASCII)
 $env:SPOT_IT_HOME = $install
 $env:SPOT_IT_FORCE_RUNTIME = '1'
 $bootstrap = Join-Path $PSScriptRoot 'bootstrap.ps1'
 $first = & ([scriptblock]::Create([IO.File]::ReadAllText($bootstrap))) -ProjectPath $project 6>&1 | Out-String
 Write-Host $first
 if ($first -notmatch 'WINDOWS_BOOTSTRAP_OK') { throw 'First-run private runtime installation did not launch Node.js.' }
 $cached = & ([scriptblock]::Create([IO.File]::ReadAllText($bootstrap))) -ProjectPath $project 6>&1 | Out-String
 Write-Host $cached
 if ($cached -notmatch 'WINDOWS_BOOTSTRAP_OK') { throw 'Cached private runtime did not launch Node.js.' }
 if ($cached -match 'Installing a private Node.js') { throw 'Cached runtime was unexpectedly downloaded again.' }
 Write-Host 'Windows PowerShell bootstrap integration passed.'
} finally {
 $env:SPOT_IT_HOME = $oldHome
 $env:SPOT_IT_FORCE_RUNTIME = $oldForce
 if (Test-Path $folder) { Remove-Item -LiteralPath $folder -Recurse -Force }
}
