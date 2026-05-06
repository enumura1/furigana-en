# Privacy Policy

EN Gloss Reader (the "extension") is designed to avoid sending page
content and translation results to external servers. Translations are
performed through Chrome's built-in Gemini Nano (Prompt API). The
extension does not make network requests for translation. Prompt API
availability and Gemini Nano setup depend on Chrome's built-in AI
requirements; see Google's
[Prompt API documentation](https://developer.chrome.com/docs/ai/prompt-api).

## Data collected

The only value the extension stores via `chrome.storage.sync` is:

- `siteAutoRun` (object: `{ [host]: boolean }`): a per-host map of
  which sites the user has opted into automatic translation on. Only
  hosts the user has explicitly toggled on are present in the map.
  Other hosts are unaffected.

Because it lives in `chrome.storage.sync`, this map follows the user
across devices through Chrome's standard sync feature. The extension's
author cannot read it.

## Page contents

- When you click **"Run on this page"** (or auto-run is enabled), the
  extension reads the body paragraphs of the active tab — the
  `<p>`, `<li>`, `<blockquote>`, `<dd>`, `<dt>`, and `<h1>`–`<h6>`
  elements — into browser memory.
- That text is handed to **Chrome's built-in Gemini Nano (Prompt
  API)**, which produces the English translation and Japanese glosses.
- **No page content or translation results are sent to external
  servers.** The source code contains
  no `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, or
  `navigator.sendBeacon` calls.

## Translation results

- Translations are written directly into the active tab's DOM and live
  nowhere else.
- For performance, parsed translation results are also held in an
  in-memory cache keyed by the original Japanese paragraph. This cache
  exists only as a JavaScript `Map` inside the content script, lives
  only while the tab is open, and is cleared on the `pagehide` event.
- All in-memory state — the live DOM, the cache, and the LanguageModel
  session itself — disappears when you navigate away, close the tab,
  or restart the browser.
- Nothing is persisted to `localStorage`, `sessionStorage`, IndexedDB,
  HTTP caches, or any other long-lived storage.

## Third parties

The extension does not share page content, translation results, or
settings with any third party. It does not include mechanisms that send
data to external services for analytics, advertising, tracking, or error
reporting.

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
- `https://*/*` (declared as `content_scripts.matches`) — the content
  script is injected on HTTPS pages so it can respond to the user's
  click on "Run on this page" or to auto-run for an opted-in host.
  Page text is only read when one of those gestures occurs. HTTP
  pages are intentionally excluded.

## Contact

Questions about this policy can be filed in the project's
[GitHub Issues](https://github.com/enumura1/furigana-en/issues).
