@echo off
set "SPOT_IT_PROJECT=%~dp0"
powershell -NoProfile -Command "& ([scriptblock]::Create([IO.File]::ReadAllText((Join-Path $env:SPOT_IT_PROJECT 'scripts\bootstrap.ps1')))) -ProjectPath $env:SPOT_IT_PROJECT"
pause
