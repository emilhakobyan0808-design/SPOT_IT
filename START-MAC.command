#!/bin/bash
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then
  echo 'Install Node.js 22.13 or later from https://nodejs.org/'
  read -r -p 'Press Enter to close this window.'
  exit 1
fi
node scripts/check-node.mjs || { read -r -p 'Press Enter to close this window.'; exit 1; }
if [ ! -d node_modules ]; then
  npm ci || { echo 'Dependency installation failed. Check your internet connection.'; read -r -p 'Press Enter to close this window.'; exit 1; }
fi
if [ ! -f dist/index.html ]; then
  npm run build || { read -r -p 'Build failed. Press Enter to close this window.'; exit 1; }
fi
echo 'Open http://localhost:3000 in your browser. Press Ctrl+C to stop.'
npm start
