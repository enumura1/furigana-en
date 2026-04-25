# Fixtures

These HTML samples exercise the extension's extraction and translation logic.
Because the content script only matches `http://*/*` and `https://*/*`,
you must serve these files via a local HTTP server rather than opening them
with `file://`.

```bash
cd test/fixtures
python3 -m http.server 8000
# then open http://localhost:8000/simple.html
```

To trigger extraction without the popup wired up, open
`chrome://extensions/`, click the extension's "service worker" link to open
its DevTools, and run:

```js
chrome.tabs.query({ active: true, currentWindow: true })
  .then(t => chrome.tabs.sendMessage(t[0].id, { type: "ENGLOSS_RUN" }));
```

Inspect the page's DevTools Console for `[EN Gloss]` log lines.
