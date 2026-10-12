# SPOT IT — Complete Beginner's User Guide

**For Windows and macOS. No programming experience required.**

This guide takes you from a computer with no SPOT IT installation to a working website. It explains what to download, which files to open, what success looks like, and what to do if something goes wrong.

The instructions describe the current local version. Installation and startup have been tested on macOS. Windows launch files are included, but a Windows computer has not yet been used for end-to-end verification.

## Fastest option: let SPOT IT set itself up

You can now start from one command without manually installing Node.js or downloading the project first. Open the [Automatic Setup Guide](docs/AUTO_START.md), choose **macOS Terminal** or **Windows PowerShell**, and paste its one-line command. It checks and installs missing requirements, downloads the project, builds it, and opens the website. The command works from any current folder.

The first run needs internet access. Later runs reuse the saved installation and can work offline. No administrator rights are required for the private runtime. Keep the terminal open while playing; press Control+C to stop.

If you have already downloaded the ZIP, its launch files now perform these checks and installation automatically too. The manual Node.js steps below are an alternative route, not a requirement for automatic setup.

## Contents

1. [Understand what you are installing](#1-understand-what-you-are-installing)
2. [Get ready](#2-get-ready)
3. [Install Node.js on Windows](#3-install-nodejs-on-windows)
4. [Install Node.js on a Mac](#4-install-nodejs-on-a-mac)
5. [Download SPOT IT from GitHub](#5-download-spot-it-from-github)
6. [Unpack the download](#6-unpack-the-download)
7. [Start SPOT IT on Windows](#7-start-spot-it-on-windows)
8. [Start SPOT IT on a Mac](#8-start-spot-it-on-a-mac)
9. [Open the website and create a profile](#9-open-the-website-and-create-a-profile)
10. [Choose your language](#10-choose-your-language)
11. [Use the lessons and quizzes](#11-use-the-lessons-and-quizzes)
12. [Use the helper and shop](#12-use-the-helper-and-shop)
13. [Play a battle on one computer](#13-play-a-battle-on-one-computer)
14. [Play with friends on other devices](#14-play-with-friends-on-other-devices)
15. [Stop and start again](#15-stop-and-start-again)
16. [Protect your saved progress](#16-protect-your-saved-progress)
17. [Install a newer version](#17-install-a-newer-version)
18. [Troubleshooting](#18-troubleshooting)
19. [Ask for help](#19-ask-for-help)
20. [Your everyday checklist](#20-your-everyday-checklist)

## 1. Understand what you are installing

SPOT IT is a learning website for children aged 8–14. It teaches media literacy through short lessons, quizzes, and games. The orange plush character is your guide.

The website runs **on your computer**. It is not a public website hosted by GitHub. GitHub stores the files you download; your computer runs them.

Three simple terms will help:

| Term | Plain-language meaning |
| --- | --- |
| Browser | The app used to view websites, such as Chrome, Edge, Safari, or Firefox. |
| Node.js | The program that allows your computer to run SPOT IT. You install it once. |
| Server window | The window that keeps SPOT IT running. Leave it open while playing. |

SPOT IT uses the address **http://localhost:3000/**. Here, `localhost` means “this computer.” The number `3000` identifies the connection used by this app.

You do not need to understand programming, edit the project files, or create a GitHub repository. You do not need to install Git, a code editor, a separate database, or a paid service.

## 2. Get ready

You will need:

- A Windows computer or a Mac.
- A browser.
- Internet access for the initial downloads and installation.
- Permission to install Node.js on that computer.
- A folder where you can keep SPOT IT and save its progress.

If the computer belongs to a school or employer, ask its administrator about installing Node.js if you do not have permission.

The first setup includes downloading Node.js, downloading SPOT IT, and installing the project's supporting libraries. Allow several minutes; timing depends on the computer and connection.

After successful setup, lessons, quizzes, images, the helper, and the shop work without internet access. Battles between devices need a local network connection, such as a shared Wi-Fi network.

Choose the Node.js installation section for your computer. You only need the Windows section **or** the Mac section.

## 3. Install Node.js on Windows

### A. Download the installer

1. Open your browser.
2. Visit the [official Node.js download page](https://nodejs.org/en/download).
3. Choose the version labelled **LTS**. SPOT IT requires Node.js **22.13 or later**.
4. Select **Windows** if the website does not select it automatically.
5. Look for the **Windows Installer**, normally a file ending in **`.msi`**.
6. Download it.

Use the installer rather than a ZIP containing standalone program files. The installer sets up the tools the launch file expects.

If the page asks about the computer's architecture, ordinary Intel/AMD Windows computers use **x64**. An ARM-based Windows computer needs the matching ARM installer. If you are unsure, ask the person who normally helps with that computer.

The Node.js website may change its layout or version numbers. The important choices are the official website, an LTS release, Windows, and an installer.

### B. Install it

1. Open the downloaded `.msi` file, usually from **Downloads**.
2. Follow the installation wizard.
3. Read any license agreement and accept it only if you agree.
4. Keep the normal installation options, including **npm** and the option to make Node.js available from the command line.
5. Finish the installation.

npm is the tool that downloads SPOT IT's supporting libraries. It is normally included with Node.js; you do not install it separately.

### C. Check that it worked

1. Open the Windows **Start** menu.
2. Type **Command Prompt** and open it.
3. Click inside its window.
4. Type this exact line and press **Enter**:

```text
node --version
```

You should see a version beginning with `v`, for example `v24...` or `v22.13...`.

A newer major version is acceptable. A version below 22, or Node.js 22 below 22.13, needs updating.

If the command is not recognized, close Command Prompt and open a new window after installing Node.js. If it still fails, see [Troubleshooting](#18-troubleshooting).

Close this check window when finished. Continue to downloading SPOT IT.

## 4. Install Node.js on a Mac

### A. Download the installer

1. Open your browser.
2. Visit the [official Node.js download page](https://nodejs.org/en/download).
3. Choose the version labelled **LTS**. SPOT IT requires Node.js **22.13 or later**.
4. Select **macOS** if necessary.
5. Download the **macOS Installer**, normally a file ending in **`.pkg`**.

Choose the installer rather than instructions for a programming version manager. The installer is the easiest route for this guide.

### B. Install it

1. Open the downloaded `.pkg` file from **Downloads**.
2. Follow the installation wizard.
3. Read any license agreement and accept it only if you agree.
4. Use the normal installation options.
5. If macOS asks for permission or your computer password, enter it on your own computer to authorize the installation.
6. Finish the installation.

Node.js normally includes npm, the tool used to download the project's supporting libraries.

### C. Check that it worked

1. Press **Command + Space** to open Spotlight search.
2. Type **Terminal**.
3. Open Terminal.
4. Type the following line and press **Return**:

```text
node --version
```

A version beginning with `v` should appear. Node.js 22.13 or later is required.

If Terminal does not find Node.js, close it and open a new Terminal window after completing the installer. More help is available in [Troubleshooting](#18-troubleshooting).

## 5. Download SPOT IT from GitHub

1. Open [the SPOT IT repository](https://github.com/emilhakobyan0808-design/SPOT_IT).
2. You should see a list of project files and a README underneath.
3. Find the **Code** button above the file list.
4. Click **Code**.
5. Choose **Download ZIP**.
6. Wait for the download to finish.

GitHub documents this download process in its [source archive guide](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives).

The downloaded file will normally be called **`SPOT_IT-main.zip`**. Its name may change if the repository or branch is renamed.

Download the **whole ZIP**, not just a single file such as `index.html` or a launch file. SPOT IT needs the project files together.

If GitHub asks you to sign in or says you do not have access, contact the repository owner. Access requirements depend on the repository's visibility.

## 6. Unpack the download

A ZIP is a package containing many files. SPOT IT must be unpacked before it is started.

### On Windows

1. Open **File Explorer**.
2. Open **Downloads** and find `SPOT_IT-main.zip`.
3. Right-click it and choose **Extract All**.
4. Choose a location such as your **Documents** folder.
5. Finish extracting.
6. Open the extracted folder.

Do not run SPOT IT from the view of files inside the unopened ZIP. That view can look like a normal folder, but the files are still packed.

### On a Mac

1. Open **Finder**.
2. Open **Downloads** and find the ZIP.
3. Double-click it to extract it.
4. Move the extracted project folder to **Documents**, or another folder you can keep and write to.
5. Open that folder.

### Check that you found the correct folder

The project folder should contain files including:

```text
README.md
USER_GUIDE.md
START-WINDOWS.cmd
START-MAC.command
package.json
package-lock.json
```

It should also contain folders such as `src`, `server`, and `public`.

If you see only another folder, open that inner folder. The correct project folder is the one containing both launch files and `package.json`.

You do not need to open or edit those other files. Keep the folder together: moving a launch file away from the project will prevent it from finding what it needs.

## 7. Start SPOT IT on Windows

### The easiest method

1. Open the extracted project folder.
2. Double-click **`START-WINDOWS.cmd`**.
3. A command window opens. It may have a dark background and scrolling text.
4. Leave it open and let it work.

During the first run, it checks Node.js, installs a private runtime if needed, installs supporting libraries, and builds the website. You may see messages about packages, files, or a build. These are normal steps, not questions you have to answer.

Do not close the window while those steps are running. Do not repeatedly double-click the launch file: one running copy is enough.

When ready, it should show:

```text
SPOT IT: http://localhost:3000
```

The window stays open. **That is the expected result.** It is now running the website.

### If double-clicking does not work

Use Command Prompt so any message remains visible:

1. Open the project folder in File Explorer.
2. Click the address bar that shows the folder's location, not the search box.
3. Type `cmd` and press **Enter**.
4. A Command Prompt window should open in that folder.
5. Type the following and press **Enter**:

```text
START-WINDOWS.cmd
```

If needed, you can also install and start manually. Enter these commands **one at a time**, waiting for each to finish before entering the next:

```text
npm ci
```

```text
npm run build
```

```text
npm start
```

The last command continues running instead of returning to a new command line. Leave that window open and continue to [opening the website](#9-open-the-website-and-create-a-profile).

## 8. Start SPOT IT on a Mac

### The easiest method

1. Open the extracted project folder in Finder.
2. Double-click **`START-MAC.command`**.
3. Terminal opens and displays text.
4. Let the first installation and build finish.
5. Leave Terminal open once you see:

```text
SPOT IT: http://localhost:3000
```

You do not need to type anything into that running window.

### If the launch file does not open

You can start it through Terminal without changing system security settings:

1. Open the project folder in Finder.
2. Open Terminal using **Command + Space**, type **Terminal**, and press Return.
3. In Terminal, type `cd` followed by a space. Do not press Return yet.
4. Drag the **project folder itself** from Finder into Terminal. This inserts the folder's location.
5. Press **Return**.
6. Type the following and press Return:

```text
bash START-MAC.command
```

The command `cd` means “use this folder.” Dragging the folder saves you from typing its full location.

The folder must be the one containing `START-MAC.command` and `package.json`. If Terminal says the file does not exist, repeat the folder-selection steps.

### Manual startup

Once Terminal is using the project folder, enter these commands **one at a time**:

```text
npm ci
```

```text
npm run build
```

```text
npm start
```

Wait for each of the first two commands to finish. The final command keeps running. Leave Terminal open while you use the website.

## 9. Open the website and create a profile

1. Confirm that the server window shows the SPOT IT address and has no startup error.
2. Open your browser.
3. Click the **address bar at the top**.
4. Type this exact address:

```text
http://localhost:3000/
```

5. Press Enter or Return.

Use the address bar, rather than a search box inside a search engine. No `www` is needed. Use `http`, not `https`, for this local prototype.

You should see SPOT IT's home page with the orange plush mascot.

To create a profile:

1. Click the profile button in the top bar or the button to start the adventure.
2. Enter a nickname of **2–20 characters**. A made-up name is enough.
3. Choose an avatar symbol.
4. Confirm the new profile.

The profile records progress, coins, and purchases. There is no email address, password, or email confirmation step.

To switch players, use the profile button and select the appropriate nickname. Profiles on this server are shared; choose your own profile.

## 10. Choose your language

The first visit normally uses Russian. Look for the language selector in the top bar near the profile.

Choose one of:

- **Русский** — Russian.
- **English** — English.
- **Español** — Spanish.
- **ქართული** — Georgian.

The choice changes menus, lesson text, questions, explanations, shop labels, and helper responses. It is saved in that browser for your next visit.

Changing language does not delete progress or purchases. It does not reset an active quiz or battle. A friend using another device can select a different language in the same match.

If you open the app in another browser, choose the language there too. Browser preferences are separate from saved player progress.

## 11. Use the lessons and quizzes

### Learning

1. Open **Learning** in the main menu.
2. Select the first available lesson.
3. Read the explanation and the example.
4. Start its three questions.
5. Choose one answer per question.
6. Read the explanation before moving on.
7. Finish the result screen.

Correctly answering at least **2 of 3** questions completes a lesson and opens the next one. If you do not pass, you can try again. Mistakes do not remove coins or access to previously opened lessons.

The course has six topics: facts and opinions, clickbait, sources, photos and context, advertising, and digital safety.

### Quizzes

Open **Quizzes** to practise an available topic. Each topic quiz contains six questions. The final quiz becomes available after all six lessons and contains 12 questions.

Regular quizzes have no countdown timer. Read carefully and take your time.

Rewards are given the first time a stage is successfully completed:

| Activity | Reward | Correct answers needed |
| --- | --- | --- |
| Lesson | 50 XP and 20 coins | 2 of 3 |
| Topic quiz | 30 XP and 15 coins | 4 of 6 |
| Final quiz | 100 XP and 40 coins | 8 of 12 |

XP shows learning progress and increases the level. Coins are the balance used in the shop. Replaying a completed stage can improve its best result, but does not repeatedly give the same reward.

## 12. Use the helper and shop

### Ask the plush helper

Click the small SPOT IT character at the **lower-right corner** of the page. On a phone, it is above the bottom menu.

The panel offers questions relevant to the current section. You can:

- Ask how to start.
- Get explanations about facts, sources, photos, advertising, and safety.
- Ask about rewards or battle rules.
- Check your progress.
- Use the button that takes you to the next activity.

Suggested question buttons are the easiest way to get a useful answer. You can also type a short question in one of the four languages.

The helper uses prepared local explanations. It does not browse the internet or act as a general-purpose AI assistant.

Use its close button, or click the small character again, to collapse it.

### Visit the shop

The shop has two kinds of items:

| Kind | What happens when purchased |
| --- | --- |
| Collectibles: toy, keychain, figurine, pencil case, and book | The item appears in **My collection**. |
| Accessories and backgrounds | The item can be equipped to change the mascot's appearance. |

Use the category buttons to browse toys, pencil cases, or books. **My collection** shows purchased collectibles.

For an accessory or background, buy it and then click **Wear** or the equivalent button in your language. You can also remove the accessory or return to the default background.

All purchases use **game coins**. There are no real payments or physical deliveries. A purchased book is a collectible product image; it does not currently open a separate readable book.

If you do not have enough coins, complete a new lesson or quiz. The shop does not allow the same item to be purchased twice.

## 13. Play a battle on one computer

Two players can test battles on the same computer using **different browsers**, for example Chrome for one player and Edge or Safari for the other.

1. Keep one SPOT IT server running.
2. Open `http://localhost:3000/` in both browsers.
3. Select a different profile in each browser.
4. In the first browser, open **Battles** and create a room.
5. Read the room's six-digit code.
6. In the second browser, open Battles and enter that code.
7. Once both players are present, the room creator starts the match.

Use different browsers or separate browser profiles. Two ordinary tabs in the same browser share the initial saved profile selection and are not the easiest setup for two players.

## 14. Play with friends on other devices

Only the **host computer** needs the SPOT IT files and Node.js. A second computer, tablet, or phone can connect using its browser.

### Set up the host

1. Start SPOT IT on the host computer.
2. Leave its server window open.
3. Look for a line beginning **Local network:**.

It will show an address resembling:

```text
Local network: http://192.168.1.20:3000
```

This is an **example**. Copy the actual address printed on your computer; do not assume the numbers will be the same.

If several addresses appear, use the one belonging to the shared Wi-Fi or local network.

### Connect the other players

1. Connect all devices to the same Wi-Fi or local network.
2. On each joining device, open a browser.
3. Type the host's printed network address in the address bar.
4. Select a different player profile.
5. Create or join a battle room using its six-digit code.

**Do not type `localhost` on the joining device.** That would refer to the joining device itself, not the host computer.

The app and API use port 3000 by default. If Windows or macOS asks about allowing this app to receive local network connections, allow it on the private/home network you are using for the game. Do not disable the entire firewall.

Some guest, school, or hotel Wi-Fi networks prevent devices from communicating directly. If the host can open the app but another device cannot, network isolation may be the cause. Ask the network administrator or try a permitted home network.

### Understand a match

- A room allows **2–4 players**.
- Only the room creator starts the game.
- Everyone receives the same question, translated into their selected language.
- There are **five rounds**, each with **20 seconds** to answer.
- Each correct answer earns **100 match points**, with up to **10 additional points** for speed.
- The answer and explanation appear after the round ends.
- After the match, players see the results.

Match points determine the scoreboard. They are separate from XP and shop coins. Connected participants can receive XP and coins for correct answers, subject to a limit of three rewarded matches per UTC day.

If a player disconnects, the game marks them as having left. They must join a new room to play again. Active matches do not survive a server restart.

## 15. Stop and start again

### Stop properly

1. Return to the window running the SPOT IT server.
2. Press **Ctrl+C**. On a Mac, this means **Control+C**, not Command+C.
3. If Windows asks whether to terminate the batch job, confirm if you want to stop it.
4. Close the window after the server stops.

Closing a browser tab only closes the page. It does not stop the server.

### Start next time

1. Open the same project folder.
2. Run the appropriate Windows or Mac launch file.
3. Wait for the server address.
4. Open `http://localhost:3000/`.
5. Select your profile if necessary.

You do not need to download the project or reinstall Node.js every time. The supporting libraries and website build remain in the project folder. The launcher also checks for source changes and rebuilds when needed.

If the folder's supporting libraries or build were removed, the launcher may install or build them again.

## 16. Protect your saved progress

Progress is stored in a folder called **`data`** inside the project. The application creates it automatically after the server starts.

It contains a database file called **`spot-it.sqlite`** and may contain related files. You do not need to open or edit them.

To make a backup:

1. Stop the server with Ctrl+C.
2. Open the project folder in File Explorer or Finder.
3. Copy the **entire `data` folder**.
4. Save that copy in a separate backup location.
5. You can start SPOT IT again after copying it.

Keep the `data` folder when you move or update the project. Deleting it removes the installation's saved profiles, progress, and purchases.

Browser history and cookies are not the main progress storage. Clearing the browser's storage may make you choose a profile or language again, but the saved server profiles remain while the database is retained.

GitHub stores project files, **not your saved player progress**. Downloading a fresh copy into a new folder normally starts with no player data.

## 17. Install a newer version

To update without losing progress:

1. Stop the old server.
2. Back up its entire `data` folder as described above.
3. Download a new project ZIP from GitHub.
4. Extract it into a **new, separate folder**.
5. Copy the backed-up `data` folder into the new project folder, beside `package.json`.
6. Run the new folder's launch file.
7. Open the website and check that the profiles and progress are present.
8. Keep the old folder and backup until you have confirmed the new version works.

Only run one version at a time on the default port. Keep the old copy stopped while trying the new one.

A new download installs the libraries and builds the website for that version. Copying only a few source files into an old folder is less suitable for a beginner because the old build may still be displayed.

## 18. Troubleshooting

### “node is not recognized” or “command not found: node”

The computer cannot find Node.js.

1. Make sure its installer completed.
2. Close all launch and terminal windows.
3. Open a new Command Prompt or Terminal and run `node --version`.
4. If it is still missing, reinstall Node.js using the official installer or ask your computer administrator.

### “SPOT IT requires Node.js 22.13 or later”

Node.js is installed, but the version is too old. Install a supported LTS release, then open a new terminal window and check the version again.

### The launch window closes, or I cannot read its message

Use the manual Windows or Mac startup method in this guide. Starting from an already-open terminal keeps the message visible.

### “package.json” was not found, or “ENOENT” appears

You may be in the wrong folder, or running files from the ZIP without extracting everything.

Check that the folder contains `package.json` and both launch files. On Windows, open Command Prompt from that folder's address bar. On a Mac, repeat the `cd` and folder-drag steps.

### Installation fails or mentions a network error

The first dependency installation needs internet access.

1. Check that ordinary websites open.
2. Retry from the project folder by entering `npm ci`.
3. If that succeeds, enter `npm run build`, then `npm start`.
4. If it keeps failing on a managed network, ask its administrator for help and provide the error text.

Do not download individual replacement libraries from unrelated websites.

### PowerShell says scripts are disabled

This can affect the `npm` command in PowerShell. Use **Command Prompt** and the Windows instructions in this guide. You do not need to change PowerShell's execution policy.

### The launcher says “permission denied” on a Mac

Open Terminal in the project folder and enter:

```text
bash START-MAC.command
```

If your account cannot write to the project folder, move the extracted project to a folder you own, such as Documents, and try again.

### “address already in use” or “EADDRINUSE”

Something is already using port 3000. A second SPOT IT launch is a common cause.

Look for an earlier server window. If it is your running SPOT IT installation, use that copy or stop it with Ctrl+C before starting another one. If you cannot identify the application using the port, ask for help rather than stopping unfamiliar processes.

### The browser says it cannot connect

1. Check that the server window is still open.
2. Confirm it shows the ready address, without a startup error afterward.
3. On the host computer, use exactly `http://localhost:3000/`.
4. Enter it in the address bar, not a search box.
5. If you intentionally selected another port, use the matching printed address.

The first installation may still be running. Wait for the ready address before opening the page.

### A phone or second computer cannot connect

First check whether the website works on the host computer.

Then check that both devices are on the same network, the joining device uses the host's printed IP address, and local connections are permitted by the host's firewall. Guest network isolation can also prevent this setup.

The host's network address may change after a Wi-Fi change or reconnection. Use the address printed by the current server launch.

### I see an old version of the website

Reload the page. If necessary, close its tab and reopen the address. Make sure the running server belongs to the project folder you intended to use.

If you manually changed files in an existing folder, stop the server, run `npm run build` in that folder, and start it again. The beginner update method is to extract a fresh download into a new folder.

### I see “ExperimentalWarning: SQLite”

Node.js 22 may display this informational warning about its built-in database module. If the server then shows its ready address and works, the warning does not prevent using SPOT IT.

### I see a warning about a JavaScript chunk larger than 500 kB

The build may display a size warning. If it still finishes successfully and starts the website, that warning alone is not a startup failure.

### A lesson or the final quiz is locked

This is part of learning progression. Complete the previous lesson. The final quiz opens after all six lessons.

### I completed a quiz again but received no coins

A stage's completion reward is paid once. Replaying it can improve the best result, but does not repeatedly generate coins.

### My collection is empty after choosing a filter

Check whether **My collection** is enabled. That filter shows only items purchased by the selected profile. Select the correct profile, or turn off that filter to browse all products.

### A battle code does not work

Check all six digits. The room must exist on the **same running server**, be waiting in the lobby, and have space for another player. A room that has already started cannot accept a new participant.

### Progress seems to have disappeared

Check that you selected the correct profile and started the same project folder. A new download has its own data folder unless you copied your backup into it.

Stop the server before restoring a backup. Keep a copy of both data folders until you understand which one contains the correct progress.

## 19. Ask for help

If you still cannot start SPOT IT, send the person helping you:

- Whether you use Windows or macOS.
- Which step of this guide you reached.
- The result of `node --version`.
- The exact error message or a screenshot of the failed launch window.
- Whether the website works on the host but fails on another device.

You do not need to send computer passwords. For startup problems, the player database is normally unnecessary: error text and the step you reached are the useful starting point.

## 20. Your everyday checklist

Once everything is installed:

1. Open your saved SPOT IT folder.
2. Run `START-WINDOWS.cmd` or `START-MAC.command`.
3. Wait for `SPOT IT: http://localhost:3000`.
4. Open that address in your browser.
5. Choose your language and profile.
6. Learn, play, and collect rewards.
7. Finish by pressing Ctrl+C in the server window.

For a friend joining from another device: keep the host running, use the same local network, and open the host's printed **Local network** address.
