# EN Gloss Reader

A Chrome extension that translates Japanese web pages into English using
Chrome's built-in Gemini Nano (Prompt API), and appends a short Japanese
gloss in parentheses next to every CEFR-B2-or-above word in the
translation. Aimed at Japanese learners of English who want to keep
reading the Japanese articles they already enjoy, but in English, without
getting stuck on unfamiliar vocabulary.

> Example: "アルゴリズムは顕著な収束性を示す" is replaced in place with
> "The algorithm exhibits(示す) remarkable(注目に値する) convergence(収束) properties."

All processing happens on-device through Chrome's bundled Gemini Nano.
**No data is sent to any external server.** See [PRIVACY.md](./PRIVACY.md)
for details.

## Requirements

- Google Chrome 140 or later (desktop only)
- A device that can run the Prompt API / Gemini Nano:
  - 22 GB or more of free storage
  - 4 GB or more of VRAM (a GPU is recommended)
  - A stable, non-metered network connection for the initial model
    download
- See Chrome's [Prompt API documentation](https://developer.chrome.com/docs/ai/prompt-api)
  for the canonical, up-to-date hardware and platform matrix.

## Install (development build)

1. Clone the repository:

   ```bash
   git clone https://github.com/enumura1/furigana-en.git
   ```

2. Open `chrome://extensions/` in Chrome and toggle **Developer mode**
   in the top-right corner.
3. Click **Load unpacked** and select the cloned directory (the one
   containing `manifest.json`).
4. Pin the extension's icon next to the address bar for quick access.

## Usage

1. Open a Japanese page you want to translate.
2. Click the extension icon to open its popup.
3. Press **このページで実行** ("Run on this page") — the body
   paragraphs will be replaced with their English translations, with
   Japanese glosses appended to difficult words.
4. Press **元に戻す** ("Restore") to revert to the original text.
5. Toggle **自動実行** ("Auto-run") on to translate every page as it
   loads. This is heavy work — leave it off unless you want it.

The first run may trigger a model download. Progress is reported in the
top-right banner.

## Known limitations

- Will not run on Chrome older than 140, on mobile builds, or on
  devices that do not support the Prompt API.
- Cannot run on internal pages such as `chrome://`, `about:`, or
  `view-source:`.
- Works one paragraph at a time. Cross-paragraph references and
  document-wide tone are not preserved.
- Paragraphs longer than 800 characters are skipped (with a console
  warning).
- LLM output may contain mistranslations or missed glosses. Treat the
  result as a study aid, not a reference translation.
- SPA-style dynamically inserted content is not handled yet (tracked
  separately as a follow-up).

## Tests

Manual fixtures live under `test/fixtures/`. See
[test/fixtures/README.md](./test/fixtures/README.md) for how to run
them. In particular, `xss-attempt.html` exercises both
prompt-injection resistance and the renderer's textContent-only DOM
construction.

## Privacy

Page bodies and translation results are never transmitted off-device,
and never persisted. See [PRIVACY.md](./PRIVACY.md) for the full
statement.

## License

MIT
