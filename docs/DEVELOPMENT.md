# SPOT IT development guide

## Architecture

One Node.js process serves the HTTP API, Socket.IO battle rooms, and the frontend. Development mode mounts Vite as middleware. Production mode serves the generated `dist` directory. The default listening address is `0.0.0.0:3000`, allowing access from the server computer and its local network.

| Path | Responsibility |
| --- | --- |
| `src/main.tsx` | Five application sections, profile selection, lessons, quizzes, shop, and battle UI |
| `src/Assistant.tsx` | Local interactive mascot helper and multilingual topic matching |
| `src/Mascot.tsx` | Plush PNG rendering and accessory overlays |
| `src/i18n.tsx` | Language selection, local storage preference, and translation formatting |
| `src/locales/` | English, Spanish, Georgian dictionaries and source key inventory |
| `src/style.css` | Responsive styles, focus states, and reduced-motion support |
| `shared/content.ts` | Lesson text, public item catalog, collectibles, and shared types |
| `server/question-bank.ts` | Question bank, correct answer indices, and explanations |
| `server/index.ts` | Express API, validation, Vite/static serving, and server startup |
| `server/store.ts` | SQLite schema, profiles, sessions, attempts, and reward claims |
| `server/battles.ts` | Socket.IO authentication, room lifecycle, grading, and timers |
| `tests/` | API, persistence, multiplayer, and localization tests |
| `public/` | Local images, favicon, brand references, and asset provenance |
| `scripts/` | Platform bootstrap scripts, shared automatic launcher, build entry point, and Node.js version validation |

## Storage model

SQLite uses WAL mode and foreign keys. The database lives in `data/spot-it.sqlite`.

- **profiles:** profile ID and JSON profile state.
- **sessions:** opaque token mapped to a profile ID.
- **claims:** unique `(profile, key)` pairs for reward deduplication.
- **attempts:** stored lesson/quiz attempts, selected question IDs, submitted answers, and final results.

A profile records its nickname, avatar, XP, coins, completed topic IDs, best results, purchased item IDs, and equipped accessory/background IDs. Shop and reward updates run in transactions. Collectibles use the same ownership array as accessories but cannot be equipped.

Sessions support convenient local profile selection; they are not a secure user account system. Anyone who can reach this trusted local server can select an existing profile. Do not deploy this prototype publicly without implementing account authentication, authorization, and deployment protections.

## HTTP API

Requests and responses use JSON. Routes requiring a profile use `Authorization: Bearer <session-token>`.

| Method and route | Purpose |
| --- | --- |
| `GET /api/health` | Readiness check |
| `GET /api/profiles` | List profile IDs, nicknames, and avatars |
| `POST /api/profiles` | Create a profile using `nickname` and optional `avatar`; return profile and token |
| `POST /api/session` | Select a profile by `id`; return profile and token |
| `GET /api/me` | Read the current profile |
| `POST /api/attempts` | Start an attempt using `mode` (`lesson` or `quiz`) and `topic` |
| `POST /api/attempts/:id/answer` | Submit the next answer using `index` and `choice`; return feedback |
| `POST /api/attempts/:id/finish` | Finalize a completed attempt and return the result and updated profile |
| `POST /api/shop/buy` | Buy an accessory, background, or collectible by `id` |
| `POST /api/shop/equip` | Equip an owned accessory/background by `id`, or clear one with `id: null` and `type` |

Topics `0–5` identify the six lessons. Topic `6` is the final quiz and is accepted only in quiz mode after all lessons are completed. Question IDs and option order remain consistent across translations; grading always uses server data.

API failures return a JSON `error` and HTTP 400. The body size is limited to 16 KB. Direct requests for server source, tests, and database paths are blocked. Browser rendering uses React text escaping.

## Battle protocol

Clients authenticate the Socket.IO connection with `auth.token`. Client events use acknowledgments of the form `{ ok: true, ... }` or `{ ok: false, error }`.

| Client event | Payload | Effect |
| --- | --- | --- |
| `create` | `{}` | Create a six-digit room code |
| `join` | Room code string | Join a lobby with up to four players |
| `start` | `{}` | Host starts a room containing at least two players |
| `answer` | `{ round, choice }` | Submit one answer for the current round |
| `leave` | `{}` | Leave the room |

The server emits **`room`** snapshots. Room states are `lobby`, `playing`, `reveal`, and `finished`. A match contains five questions, with a 20-second answer window and a 3.5-second explanation window by default.

Playing snapshots contain public question fields and whether players have answered. Correct answer indices, submitted choices, and correctness scores are withheld until the reveal. The server checks the round, choice bounds, deadline, and duplicate submissions. Scoring and reward claims are handled on the server.

Rooms are in memory. Disconnecting marks the player as having left; the lobby transfers hosting when necessary. When fewer than two players remain, the match ends after the current round. Finished rooms expire after ten minutes. Reconnection to an active match is not implemented.

## Add course content

1. Update lesson text in `shared/content.ts`.
2. Add questions to `server/question-bank.ts`: stable ID, topic index, prompt, options, correct option index, explanation, and question kind.
3. Keep examples fictional and label them as learning situations. Explain how to verify evidence, dates, and context.
4. Add every new Russian source string to `src/locales/keys.json` and provide matching entries in `en.json`, `es.json`, and `ka.json`.
5. Run `npm test` and `npm run build`.

The six-topic course structure and final topic index are currently explicit in the app and server. Adding a seventh topic requires updating progression, final-quiz checks, counts, and related UI rather than only appending an array element.

## Add products or accessories

- Add equipable items to `items` in `shared/content.ts`, with `type: accessory` or `type: background`.
- Add virtual collectibles to `merchandise`, with an image path and category (`toys`, `stationery`, or `books`).
- Store image files under `public/merch/` and provide all translated names/descriptions.
- For a new accessory, implement its overlay in `src/Mascot.tsx`.
- The server validates item IDs, ownership, and coin balances. Do not implement coin deductions only in the client.

Product images represent fictional game collectibles. Adding real payment, inventory, shipping, or fulfillment is outside this prototype.

## Localization and helper

Russian strings are the translation keys. `t(key, ...values)` reads the selected dictionary and fills numbered placeholders such as `{0}`. The browser saves `spot-language`; it also saves the selected profile's `spot-token`. The root HTML language follows the selected language.

Translations do not change server question IDs or grading indices. The helper matches short questions in all four languages to prepared responses; suggested questions use known source keys. When extending helper topics, update both the matching rules and translations.

## Build, test, and update

```sh
npm ci
npm test
npm run check
npm run build
npm start
```

`npm run build` checks TypeScript and calls Vite through `scripts/build.mjs`. The lock file is committed; use `npm ci` for a reproducible installation. Test fixtures use temporary databases and actual separate Socket.IO clients.

Before updating an existing installation, stop the server and back up `data`. Update source files, install locked dependencies, rebuild, and start the app. The double-click launchers now use automatic setup and a shared launcher. Fingerprints in `.spot-it/state.json` track dependency inputs, platform, Node major version, and build inputs. Missing dependencies trigger installation; changed frontend sources trigger rebuilding. See [Automatic Setup](AUTO_START.md) for installation locations and entry commands.

Git excludes `node_modules`, `dist`, `data`, `.spot-it`, and logs. Do not commit player databases, session tokens, or local credentials. Runtime images and reference assets remain tracked so a downloaded project runs without an external image service.
