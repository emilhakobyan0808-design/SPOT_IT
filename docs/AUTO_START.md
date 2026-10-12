# Automatic setup and launch

SPOT IT can download its own requirements and start with one pasted command. You do not need to install Node.js, Git, or a code editor first. Administrator rights are not needed: a missing Node.js runtime is installed privately for this app.

Windows and macOS have different built-in shells, so the entry command differs. Both commands use the same application launcher after setup and work from any current folder.

## macOS — Terminal

Open **Terminal** using Command + Space. Paste this entire line and press Return:

```sh
spot_bootstrap="$HOME/Library/Application Support/SPOT IT/bootstrap.sh"; if [ -f "$spot_bootstrap" ]; then bash "$spot_bootstrap"; else curl -fsSL https://raw.githubusercontent.com/emilhakobyan0808-design/SPOT_IT/main/scripts/bootstrap.sh | bash; fi
```

## Windows — PowerShell

Open **PowerShell** from the Start menu, as your normal user. Paste this entire line and press Enter:

```powershell
$spotBootstrap = Join-Path $env:LOCALAPPDATA 'SPOT IT\bootstrap.ps1'; if (Test-Path $spotBootstrap) { & ([scriptblock]::Create([IO.File]::ReadAllText($spotBootstrap))) } else { & ([scriptblock]::Create((Invoke-RestMethod 'https://raw.githubusercontent.com/emilhakobyan0808-design/SPOT_IT/main/scripts/bootstrap.ps1'))) }
```

Use PowerShell for the Windows command, not Command Prompt. No change to PowerShell's execution policy is required.

## What happens automatically

1. The first command downloads a small setup script from this GitHub repository. Later runs use its saved local copy.
2. Setup checks whether a compatible Node.js installation and npm are available.
3. If needed, it downloads an official Node.js 24 runtime for your computer's architecture. Its SHA-256 checksum is checked against the official manifest before installation.
4. Setup downloads the project ZIP from GitHub if it has not already been installed.
5. Each launch checks GitHub for a newer app revision. An available update is downloaded and built separately before it replaces source files. Player data is kept untouched. If GitHub is unreachable, the installed version is used.
6. The shared launcher checks the project dependencies. Missing or changed dependencies are installed using the committed lock file.
7. The launcher builds the website if needed. Source changes cause it to rebuild; unchanged files do not.
8. It starts the server and waits for its readiness response.
9. It opens the ready website in the default browser. Keep the terminal window open while playing.

The first run needs internet access and may take several minutes. Subsequent runs need no internet when the cached script, runtime, project, dependencies, and build are complete and unchanged.

A compatible system Node.js is reused. Otherwise the app's private runtime is used; an older system version is not removed. The installer does not change global PATH settings, shell profiles, PowerShell execution policy, or the computer's firewall.

If port 3000 is busy with another application, the launcher searches the next ports and prints the chosen address. If it identifies an already running SPOT IT server, it opens that existing server. That server's saved profiles are used; stop it first if you want to switch installations.

## Where files are installed

| System | Application files |
| --- | --- |
| macOS | `~/Library/Application Support/SPOT IT/app` |
| Windows | `%LOCALAPPDATA%\SPOT IT\app` |

The private runtime, when needed, lives beside `app` in a `runtime` folder. Player data remains inside `app/data`.

For an easy next launch, setup also creates:

- **Mac:** `start.sh` beside the `app` folder. Run it with `bash` or use the same command above.
- **Windows:** `start.cmd` beside the `app` folder. You can double-click it in File Explorer.

The commands above work from any current directory. They look for the installed setup script before contacting GitHub, so the same command can be reused offline after a successful setup.

## Already downloaded the ZIP?

The existing **START-MAC.command** and **START-WINDOWS.cmd** now use automatic setup too. Open the appropriate file in the extracted project folder; it checks and installs a private runtime if needed, installs libraries, builds, and starts that local copy. Keep those launch files with the project.

They use the folder containing the launch file, not the folder your terminal happened to be in. Paths containing spaces are supported. If you already have compatible Node.js, you can also run the shared script by its full path:

```sh
node "/full/path/to/SPOT_IT/scripts/launch.mjs"
```

Replace the example path with the actual path on your computer. `npm run launch` is available when your terminal is inside the project folder.

## Stop, restart, and update

Press **Control+C** in the running terminal to stop. Run the same command or launch file next time. Progress and purchases are preserved in the installation's `data` folder.

### Updating is now the normal launch

1. Stop the running server with **Control+C**.
2. Run your usual launch command or double-click the launch file.
3. If GitHub has a newer version, setup downloads it, installs its libraries and verifies its build before changing the installed files.
4. SPOT IT starts with your existing profiles, progress and purchases.

There is no need to download another ZIP or copy the database manually. An unchanged version is not downloaded again. If there is no internet or update preparation fails, the working installed version starts instead.

Source backups are created beside the app in folders beginning `.spot-it-backup-`. These backups contain previous source files and supporting libraries; the live database remains in the app's `data` folder. Keep separate data backups as described in the User Guide.

If SPOT IT is still running, setup asks you to stop it rather than replacing files during a match. A Git checkout containing `.git` is treated as a developer checkout and is not automatically replaced.

### One-time upgrade for older installers

If your saved installer was created before automatic updates were added, run the current setup once directly from GitHub:

**Mac, Terminal:**

```sh
curl -fsSL https://raw.githubusercontent.com/emilhakobyan0808-design/SPOT_IT/main/scripts/bootstrap.sh | bash
```

**Windows, PowerShell:**

```powershell
& ([scriptblock]::Create((Invoke-RestMethod 'https://raw.githubusercontent.com/emilhakobyan0808-design/SPOT_IT/main/scripts/bootstrap.ps1')))
```

After this one-time upgrade, the saved launch command and start file check for future updates automatically. Internet is needed for this upgrade; existing player data is retained.

## If something goes wrong

- **Download fails:** check internet access, then run the command again. Node.js archives come from `nodejs.org`; the project comes from GitHub. Those sites must be reachable.
- **Checksum fails:** no new runtime is installed. Retry the download; do not bypass the check.
- **Missing libraries after interrupted installation:** the next launch checks for required files and installs again.
- **Another setup is running:** use the first setup window and wait for it. Do not launch several installers at once.
- **Incomplete managed app folder:** preserve its `data` folder and ask for help before replacing the incomplete app. The installer does not overwrite an existing partial project automatically.
- **Browser does not open:** copy the printed **Ready** address into your browser's address bar.
- **Wrong profiles appear:** the launcher may have found another running SPOT IT installation. Stop that server before starting the installation whose data you want.
- **Managed computer restrictions:** ask its administrator. The launcher does not disable security settings or install drivers.

See the [Complete Beginner's User Guide](../USER_GUIDE.md) for profiles, lessons, quizzes, the shop, multiplayer, backups, and further troubleshooting.

## Verification and developer options

On macOS, private runtime download and checksum verification, first dependency installation, production build, startup from an unrelated directory, and cached repeat launch have been tested. Automated tests cover source fingerprints, missing dependencies, cached builds, occupied ports, and existing server recognition. Update tests also cover database preservation, source backups, incomplete updates, offline fallback, and unchanged revisions. A physical Windows end-to-end test is still required.

Developer options:

- `node scripts/launch.mjs --no-open` or `SPOT_IT_NO_OPEN=1`: do not open a browser.
- `node scripts/launch.mjs --port 3010` or `PORT=3010`: choose the initial port.
- `SPOT_IT_HOME`: use a different private setup folder.
- `SPOT_IT_SKIP_UPDATE=1`: deliberately skip the GitHub update check for this run.
- `SPOT_IT_FORCE_RUNTIME=1`: use the private runtime instead of a system Node.js installation.

The setup code is in [`bootstrap.sh`](../scripts/bootstrap.sh), [`bootstrap.ps1`](../scripts/bootstrap.ps1), and [`launch.mjs`](../scripts/launch.mjs). Official platform references: [Node.js release downloads](https://nodejs.org/dist/index.json), [PowerShell Invoke-RestMethod](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-restmethod?view=powershell-5.1).
