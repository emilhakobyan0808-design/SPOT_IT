#!/bin/bash
# Automatic user-local setup. Works from any current directory; no sudo needed.
set -euo pipefail
install_root="${SPOT_IT_HOME:-$HOME/Library/Application Support/SPOT IT}"
project_path=""
while [ $# -gt 0 ]; do
 case "$1" in
  --project) project_path="$2"; shift 2 ;;
  *) echo "Unknown option: $1" >&2; exit 1 ;;
 esac
done
if [ "$(uname -s)" != Darwin ]; then echo 'This entry point is for macOS. Use bootstrap.ps1 on Windows.' >&2; exit 1; fi
for tool in curl tar shasum unzip; do command -v "$tool" >/dev/null || { echo "Required macOS tool is missing: $tool" >&2; exit 1; }; done
mkdir -p "$install_root"
bootstrap_lock="$install_root/.bootstrap-lock"
if ! mkdir "$bootstrap_lock" 2>/dev/null; then
 if [ -f "$bootstrap_lock/pid" ] && kill -0 "$(cat "$bootstrap_lock/pid")" 2>/dev/null; then echo 'SPOT IT setup is already running in another window.'; exit 0; fi
 rm -rf "$bootstrap_lock"
 mkdir "$bootstrap_lock"
fi
printf '%s\n' "$$" > "$bootstrap_lock/pid"
temp_dir=""
cleanup(){ [ -z "$temp_dir" ] || rm -rf "$temp_dir"; rm -rf "$bootstrap_lock"; }
trap cleanup EXIT
trap 'exit 130' INT TERM
node_binary=""
npm_cli=""
compatible(){ "$1" -e 'const [a,b]=process.versions.node.split(".").map(Number);process.exit(a>22||a===22&&b>=13?0:1)' >/dev/null 2>&1; }
if [ "${SPOT_IT_FORCE_RUNTIME:-0}" != 1 ] && command -v node >/dev/null && command -v npm >/dev/null && compatible "$(command -v node)"; then
 node_binary="$(command -v node)"
elif [ -x "$install_root/runtime/bin/node" ] && compatible "$install_root/runtime/bin/node"; then
 node_binary="$install_root/runtime/bin/node"; npm_cli="$install_root/runtime/lib/node_modules/npm/bin/npm-cli.js"
else
 case "$(uname -m)" in arm64) arch=arm64 ;; x86_64) arch=x64 ;; *) echo 'This Mac architecture is not supported.' >&2; exit 1 ;; esac
 echo 'Installing a private Node.js runtime for SPOT IT. Your system installation will not be changed.'
 temp_dir="$(mktemp -d "$install_root/.setup.XXXXXX")"
 curl --fail --location --retry 2 --silent --show-error https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt -o "$temp_dir/SHASUMS256.txt"
 archive="$(awk -v arch="$arch" '$2 ~ "^node-v24[.][0-9]+[.][0-9]+-darwin-" arch "[.]tar[.]gz$" {print $2; exit}' "$temp_dir/SHASUMS256.txt")"
 [ -n "$archive" ] || { echo 'Could not locate the official Node.js archive.' >&2; exit 1; }
 curl --fail --location --retry 2 --silent --show-error "https://nodejs.org/dist/latest-v24.x/$archive" -o "$temp_dir/$archive"
 expected="$(awk -v file="$archive" '$2==file {print $1}' "$temp_dir/SHASUMS256.txt")"
 actual="$(shasum -a 256 "$temp_dir/$archive" | awk '{print $1}')"
 [ "$actual" = "$expected" ] || { echo 'Node.js download failed its checksum check. Nothing was installed.' >&2; exit 1; }
 mkdir "$temp_dir/unpacked"
 tar -xzf "$temp_dir/$archive" -C "$temp_dir/unpacked"
 downloaded="$temp_dir/unpacked/${archive%.tar.gz}"
 compatible "$downloaded/bin/node" || { echo 'The downloaded Node.js runtime cannot run on this Mac.' >&2; exit 1; }
 [ ! -d "$install_root/runtime" ] || mv "$install_root/runtime" "$temp_dir/old-runtime"
 mv "$downloaded" "$install_root/runtime"
 node_binary="$install_root/runtime/bin/node"; npm_cli="$install_root/runtime/lib/node_modules/npm/bin/npm-cli.js"
fi
export PATH="$(dirname "$node_binary"):$PATH"
[ -z "$npm_cli" ] || export SPOT_IT_NPM_CLI="$npm_cli"
if [ -z "$project_path" ]; then
 project_path="$install_root/app"
 if [ ! -f "$project_path/scripts/launch.mjs" ] || [ ! -f "$project_path/package-lock.json" ]; then
  echo 'Downloading the SPOT IT project from GitHub.'
  [ -n "$temp_dir" ] || temp_dir="$(mktemp -d "$install_root/.setup.XXXXXX")"
  curl --fail --location --retry 2 --silent --show-error https://github.com/emilhakobyan0808-design/SPOT_IT/archive/refs/heads/main.zip -o "$temp_dir/app.zip"
  mkdir -p "$temp_dir/project"
  unzip -q "$temp_dir/app.zip" -d "$temp_dir/project"
  source_path="$temp_dir/project/SPOT_IT-main"
  [ -f "$source_path/scripts/launch.mjs" ] && [ -f "$source_path/package-lock.json" ] || { echo 'The downloaded project is incomplete.' >&2; exit 1; }
  [ ! -d "$project_path" ] || { echo 'An incomplete app folder already exists. Keep its data folder and ask for help before replacing it.' >&2; exit 1; }
  mv "$source_path" "$project_path"
 fi
 cp "$project_path/scripts/bootstrap.sh" "$install_root/bootstrap.sh"
 cat > "$install_root/start.sh" <<'START'
#!/bin/bash
set -e
root="$(cd "$(dirname "$0")" && pwd)"
bash "$root/bootstrap.sh" --project "$root/app"
START
 chmod +x "$install_root/start.sh"
fi
[ -f "$project_path/scripts/launch.mjs" ] || { echo 'Choose the project folder containing scripts/launch.mjs.' >&2; exit 1; }
updater="$project_path/scripts/update.mjs"
if [ ! -f "$updater" ]; then
 updater="$install_root/update.mjs"
 curl --fail --location --silent --show-error --connect-timeout 10 --max-time 30 https://raw.githubusercontent.com/emilhakobyan0808-design/SPOT_IT/main/scripts/update.mjs -o "$updater" || true
fi
if [ -f "$updater" ]; then "$node_binary" "$updater" --project "$project_path"; fi
if [ "$project_path" = "$install_root/app" ]; then cp "$project_path/scripts/bootstrap.sh" "$install_root/bootstrap.sh"; fi
cleanup
trap - EXIT
exec "$node_binary" "$project_path/scripts/launch.mjs"
