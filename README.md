# EN Gloss Reader

A Chrome extension that translates Japanese web pages into English using
Chrome's built-in Gemini Nano (Prompt API). It then annotates the
translation in two ways:

- **Japanese gloss as ruby** under every CEFR-B2-or-above English word
  (rendered with the native `<ruby>` element + `ruby-position: under`),
  so the meaning sits below the word without breaking reading flow.
- **Pink tint on main and auxiliary verbs**, so sentence structure is
  easier to scan.

Aimed at Japanese learners of English who want to keep reading the
Japanese articles they already enjoy, but in English, without getting
stuck on unfamiliar vocabulary.

> Example: "アルゴリズムは顕著な収束性を示す" is replaced in place with
> "The algorithm **exhibits** remarkable convergence properties." —
> with the verb "exhibits" tinted pink and Japanese glosses (示す, 顕著な,
> 収束) sitting underneath the corresponding English words.

All processing happens on-device through Chrome's bundled Gemini Nano.
**No data is sent to any external server.** See [PRIVACY.md](./PRIVACY.md)
for details.

**Project site**: <https://enumura1.github.io/furigana-en/>
(landing page + privacy policy hosted via GitHub Pages)

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
   paragraphs are replaced with their English translations, with the
   Japanese gloss for each difficult word appearing as ruby
   underneath, and main/auxiliary verbs tinted pink.
4. Press **元に戻す** ("Restore") to revert to the original Japanese.
5. Toggle **このサイトで自動実行** ("Auto-run on this site") on to make
   the extension translate every page on the current host (e.g.
   `ja.wikipedia.org`) as it loads. The toggle is per-site — turning it
   on for Wikipedia does not affect Google search results, GitHub, or
   any other domain. The popup shows the active host and the current
   on/off state so the setting is unambiguous.

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

[MIT](./LICENSE)
