# SPOT IT — Notice what matters

A local media literacy adventure for children aged 8–14. Learn to check information, complete quizzes, collect rewards, and play real multiplayer battles with friends.

**Languages:** Russian, English, Spanish, and Georgian. The interface, six lessons, 36 questions, explanations, shop, and interactive mascot helper are translated. The application runs on Windows and macOS without internet access after the initial dependency installation.

**New to installing software? Start with the [Complete Beginner’s User Guide](USER_GUIDE.md).** It walks through Node.js installation, downloading and unpacking the project, first launch, profiles, languages, multiplayer, backups, updates, and troubleshooting.

## Download and run

Install **Node.js 22.13 or later**, including npm, from [nodejs.org](https://nodejs.org/). Check the installed version with `node --version`.

1. Open [the GitHub repository](https://github.com/emilhakobyan0808-design/SPOT_IT).
2. Choose **Code → Download ZIP**, then extract the entire archive to a folder you can write to.
3. Open **START-WINDOWS.cmd** on Windows or **START-MAC.command** on macOS.
4. The launcher installs dependencies on the first run and builds the application if no build is available. Internet access is needed for the initial installation.
5. Open **http://localhost:3000/** and keep the terminal window open while using the app.

On macOS, if the launcher is not executable, open Terminal in the extracted project folder and run `bash START-MAC.command`. If the operating system prevents launching the file, use the manual commands below.

The GitHub repository contains source files and assets. Generated builds, dependencies, and player data are excluded from Git. The launcher builds the downloaded source automatically.

### Manual startup — Windows and macOS

Open a terminal in the project folder:

```sh
npm ci
npm run build
npm start
```

For later launches, run `npm start`. After changing source files, run `npm run build` again before starting the production server.

For development, run `npm run dev` after installing dependencies. This starts the backend and the frontend development server together, without a separate build step.

Stop the server with **Ctrl+C**. If port 3000 is in use, stop the other copy of the server or choose another port:

```sh
# macOS
PORT=3001 npm start
```

```powershell
# Windows PowerShell
$env:PORT = "3001"
npm start
```

## Five sections

| Section | Features |
| --- | --- |
| Home | Meet SPOT IT, see your progress, and choose your next activity. |
| Learning | Six sequential lessons, each with an explanation, a fictional example, and three interactive questions. |
| Quizzes | Six questions per topic and a final quiz with 12 randomly selected questions. Each answer includes an explanation. |
| Shop | Five collectible products, five mascot accessories, and three backgrounds. Purchases use game coins and remain in the profile. |
| Battles | Real rooms for 2–4 players, shared questions, five timed rounds, explanations, and a scoreboard. |

The course covers facts and opinions, clickbait, source verification, image context, advertising, and personal data safety. Questions teach children to check evidence rather than judge credibility by appearance or popularity.

The collectible products are a plush toy, keychain, figurine, pencil case, and book featuring SPOT IT. They are **virtual collectibles**: there are no real payments or physical deliveries. Accessories and backgrounds can be equipped and removed; collectible products stay in **My collection**.

## Play with friends on the same network

1. Start the application on **one computer**.
2. Connect all participating devices to the same trusted Wi-Fi or local network.
3. The terminal prints a network address such as `http://192.168.1.20:3000`. Open that address on the other devices.
4. Select different player profiles.
5. In **Battles**, one player creates a room and shares its six-digit code. Others enter that code. The host starts the battle when at least two players have joined.

On another device, use the **server computer's local IP address**, not `localhost`. The page, API, and Socket.IO all use the same port. If a firewall asks, allow access on your private/home network when you need multiplayer. Guest Wi-Fi networks with client isolation may block connections between devices.

The app is intended for a trusted local network. It does not require internet hosting or router port forwarding. Profiles have no passwords; the profile selector is shared by the server and is not an account authentication system. Use nicknames instead of personal information. For two players on one computer, use separate browser profiles or browsers: tabs in the same browser initially share the saved profile selection.

If the host leaves the lobby, the next player becomes the host. A player who disconnects during a game is marked as having left. If fewer than two players remain connected, the match ends after the current round. Rejoining an interrupted match is not supported; create or join a new room. Restarting the server ends active battles but preserves player progress.

## Languages and the mascot helper

Choose **Русский / English / Español / ქართული** in the top bar next to the profile. The preference is saved in that browser. Changing language does not reset progress, purchases, or an active quiz or battle. Players in the same room can use different languages. Nicknames are kept as entered.

Click the plush SPOT IT in the lower-right corner to open the helper. It explains course topics, rewards, battle rules, and your progress. Select a suggested question or type a short question in a supported language.

The helper uses local, prepared responses and topic matching. It is a course guide, not a general-purpose AI chat. Questions are not sent to an external service. Translations are also stored locally.

## Rewards

| Activity | First successful completion | Passing requirement |
| --- | --- | --- |
| Lesson | 50 XP + 20 coins | At least 2 of 3 answers correct |
| Topic quiz | 30 XP + 15 coins | At least 4 of 6 answers correct |
| Final quiz | 100 XP + 40 coins | At least 8 of 12 answers correct |

- Replaying a stage improves the best result but does not award its completion reward again.
- Every 100 XP increases the level. Coins can be spent; XP is not spent.
- Battles award **100 match points** per correct answer and up to **10 extra points** for speed. The server measures time.
- Connected players receive **10 XP + 3 coins** per correct battle answer, for at most **three rewarded battles per UTC day**.
- Match points, XP, and spendable coins are separate values.

The server validates answer order, purchases, balances, and rewards. Duplicate answers are rejected. SQLite transactions and unique reward claims prevent duplicate completion rewards. Correct battle answers and correctness scores are revealed only after the round ends.

## Data and backups

Player data is created automatically in **`data/spot-it.sqlite`**. Profiles, completed lessons, best results, balances, purchases, equipped items, and profile sessions persist across restarts. Battle rooms and timers are held in memory.

To back up progress, **stop the server and copy the entire `data` folder**. Keep this folder when updating the application. Do not copy the database while it is being written. Git and downloadable source archives exclude player data.

## Development and tests

```sh
npm run dev       # Backend and frontend development server
npm run check     # TypeScript checks
npm test          # Server, persistence, multiplayer, shop, and translation tests
npm run build     # TypeScript checks and production frontend build
npm start         # Serve the production build
```

Tests use separate temporary databases and do not change your saved progress. Coverage includes profile switching, sequential lesson unlocking, server grading, duplicate reward protection, shop purchases, collectibles, equipment, persistence after a full server restart, real Socket.IO clients, secret answers before round completion, full rooms, host handover, disconnects, and translation completeness.

**Verification:** tested on macOS with Node.js 22.20. TypeScript checks, production builds, automated tests, and HTTP serving passed. Multiplayer was tested using separate network clients on one computer. Windows startup and play between physically separate devices still need verification. Visual browser QA has not been completed because permission to access the local preview was declined.

See [Development documentation](docs/DEVELOPMENT.md) for the architecture, API, content model, and extension guide.

## Assets and technology

The original plush mascot and merchandise images were prepared with ImageGen using the supplied character references. Transparent PNG assets are included in the repository and require no generation service at runtime.

- [Mascot source and generation prompt](public/mascot/PROCESS.md)
- [Collectible product images and generation prompts](public/merch/PROCESS.md)

Built with **React 19, TypeScript, Vite, Node.js, Express, Socket.IO, and SQLite** through Node's built-in `node:sqlite` module. SQLite requires no separate installation or native extension compilation. Node.js 22 may print an `ExperimentalWarning` for SQLite; this does not stop the application. Dependency versions are pinned in `package-lock.json`.
