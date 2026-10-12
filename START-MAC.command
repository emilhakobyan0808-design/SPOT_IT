#!/bin/bash
project_root="$(cd "$(dirname "$0")" && pwd)"
bash "$project_root/scripts/bootstrap.sh" --project "$project_root"
result=$?
if [ "$result" -ne 0 ]; then read -r -p 'Startup failed. Press Enter to close this window.'; fi
exit "$result"
