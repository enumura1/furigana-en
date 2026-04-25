# Privacy Policy

EN Gloss Reader (the "extension") is designed to keep all user data on
the device. Every translation is performed by Chrome's built-in Gemini
Nano (Prompt API) running locally; the extension never opens a network
connection of its own.

## Data collected

The only value the extension stores via `chrome.storage.sync` is:

- `autoRun` (boolean): whether translation should run automatically
  whenever a page finishes loading.

Because it lives in `chrome.storage.sync`, this flag follows the user
across devices through Chrome's standard sync feature. The extension's
author cannot read it.

## Page contents

- When you click **"Run on this page"** (or auto-run is enabled), the
  extension reads the body paragraphs of the active tab — the
  `<p>`, `<li>`, `<blockquote>`, `<dd>`, `<dt>`, and `<h1>`–`<h6>`
  elements — into browser memory.
- That text is handed to **Chrome's built-in Gemini Nano running
  locally**, which produces the English translation and Japanese
  glosses.
- **Nothing is sent to any external server.** The source code contains
  no `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, or
  `navigator.sendBeacon` calls.

## Translation results

- Translations are written directly into the active tab's DOM and live
  nowhere else.
- They disappear when you navigate away, close the tab, or restart the
  browser.
- Nothing is persisted to `localStorage`, `sessionStorage`, IndexedDB,
  or any cache.

## Third parties

None. The extension does not share data with any third party.

## Analytics and tracking

None. The extension contains no analytics SDK, telemetry, or tracking
pixel.

## Cookies and credentials

The extension does not read `document.cookie`, and it does not read the
values of form fields (`<input>`, `<textarea>`, etc.). It does not
request the `tabs`, `cookies`, `history`, `webRequest`, or `identity`
permissions.

The permissions it does request are:

- `storage` — to persist the user setting described above.
- `activeTab` — to act on the tab the user explicitly invoked the
  popup on.
- `scripting` — to re-inject the content script if the active tab
  pre-existed the extension's installation.

## Contact

Questions about this policy can be filed in the project's
[GitHub Issues](https://github.com/enumura1/furigana-en/issues).

## Changelog

- 2026-04-26: Initial version.
