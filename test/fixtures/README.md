# Fixtures

Manual test pages for the extension. Because the content script only matches
`http://*/*` and `https://*/*`, you must serve these files via a local HTTP
server rather than opening them with `file://`.

```bash
cd test/fixtures
python3 -m http.server 8000
# then open http://localhost:8000/<file>.html
```

## Files

| File | What it covers |
| --- | --- |
| `simple.html` | Five well-formed Japanese paragraphs in `<article>`. Baseline. |
| `mixed.html` | JA + EN mix — English-only paragraphs must be skipped by the CJK ratio gate. |
| `code.html` | `<pre><code>` blocks must NOT be translated; surrounding `<p>` must. |
| `xss-attempt.html` | Prompt-injection attempts and a literal `<script>` tag in the page. |
| `long.html` | Six mid-length Japanese essay paragraphs in `<article>`. General-purpose demo page; useful for Web Store screenshots. |
| `nested.html` | `<li><p>...</p></li>` and `<dl>` — inner blocks must take precedence over outer wrappers. |

## How to trigger a run

After loading the unpacked extension, click its icon and press
"このページで実行" — or, when iterating without the popup, open the
extension's service-worker DevTools (`chrome://extensions/` → "service
worker" link) and run:

```js
chrome.tabs.query({ active: true, currentWindow: true })
  .then(t => chrome.tabs.sendMessage(t[0].id, { type: "ENGLOSS_RUN" }));
```

Watch the page's DevTools Console for `[EN Gloss]` log lines.

## Safety checks for xss-attempt.html

1. **No script execution from translated output.** Open DevTools BEFORE running.
   Run the extension. The page's own `<script>` (which sets
   `window.__englossXssMarker = "page-script-did-run"`) executes during normal
   page load — that is expected and unrelated. What must NOT happen: an
   `alert()` dialog, or a new global appearing as a side effect of translation.

2. **No prompt-injection compliance.** The translated paragraphs must not
   contain literal `document.cookie` values, password text, or anything that
   looks like the model carried out the injected instructions. The model
   should translate the malicious sentences as plain text.

3. **No HTML parsing of model output.** Inspect the replaced `<p>` elements
   in DevTools — every gloss must be wrapped in `<span class="engloss-word">`
   built via `createTextNode`. There must be no `<script>`, `<img>`, or any
   other tag that originated in the model's response.

4. **Restore works.** Press "元に戻す" — every paragraph reverts to its
   original Japanese text and every `data-engloss-*` attribute disappears.
