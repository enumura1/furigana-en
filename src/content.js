// EN Gloss Reader content script. Step 2: paragraph extraction only (no LLM, no DOM mutation).
"use strict";

(function () {
  // Tag classification.
  const SKIP_TAGS = new Set([
    "SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "KBD", "SAMP",
    "TEXTAREA", "INPUT", "SELECT", "OPTION"
  ]);
  const TARGET_SELECTOR = "p, li, blockquote, dd, dt, h1, h2, h3, h4, h5, h6";

  // Length and language gates per spec section 5.2.
  const MIN_LEN = 10;
  const MAX_LEN = 800;
  const CJK_RATIO = 0.2;
  const CJK_MIN = 5;
  const CJK_REGEX = /[\u3040-\u30ff\u3400-\u9fff]/g;

  // Pick the highest-priority root: article > main > body.
  function getRoot() {
    return document.querySelector("article") ||
           document.querySelector("main") ||
           document.body ||
           document.documentElement;
  }

  // Walk ancestors to reject children of script/code/contenteditable etc.
  function hasSkippedAncestor(el) {
    let cur = el.parentElement;
    while (cur) {
      if (SKIP_TAGS.has(cur.tagName)) return true;
      if (cur.getAttribute && cur.getAttribute("contenteditable") === "true") return true;
      cur = cur.parentElement;
    }
    return false;
  }

  // True when the element wraps another target-tag block (prefer the inner one).
  function containsBlockDescendant(el) {
    return el.querySelector(TARGET_SELECTOR) !== null;
  }

  // CJK ratio gate per spec section 5.2.
  function passesCjkFilter(text) {
    const matches = text.match(CJK_REGEX);
    if (!matches || matches.length < CJK_MIN) return false;
    return matches.length / text.length >= CJK_RATIO;
  }

  // Truncate for safe console output (spec invariant #15).
  function preview(text) {
    return text.length > 30 ? text.slice(0, 30) + "..." : text;
  }

  // Collect translatable paragraph candidates from the chosen root.
  function extractParagraphs() {
    const root = getRoot();
    if (!root) return [];
    const candidates = root.querySelectorAll(TARGET_SELECTOR);
    const result = [];
    for (const el of candidates) {
      if (el.hasAttribute("data-engloss-done")) continue;
      if (el.getAttribute("contenteditable") === "true") continue;
      if (SKIP_TAGS.has(el.tagName)) continue;
      if (hasSkippedAncestor(el)) continue;
      if (containsBlockDescendant(el)) continue;
      const text = (el.textContent || "").trim();
      if (text.length < MIN_LEN) continue;
      if (text.length > MAX_LEN) {
        console.warn("[EN Gloss] paragraph exceeds 800 chars, skipping:", preview(text));
        continue;
      }
      if (!passesCjkFilter(text)) continue;
      result.push({ el, text });
    }
    return result;
  }

  // Step-2 diagnostic: log candidate count and short previews.
  function debugLog(candidates) {
    console.log(`[EN Gloss] ${candidates.length} paragraph(s) extracted`);
    for (const { el, text } of candidates) {
      console.log(`  - <${el.tagName.toLowerCase()}>`, preview(text));
    }
  }

  // Message router (popup -> content). Popup ships in step 6; for now ENGLOSS_RUN
  // can be triggered from the extension's service-worker DevTools:
  //   chrome.tabs.query({active:true,currentWindow:true})
  //     .then(t => chrome.tabs.sendMessage(t[0].id, {type:"ENGLOSS_RUN"}))
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (!msg || typeof msg.type !== "string") return false;
    if (msg.type === "ENGLOSS_RUN") {
      const candidates = extractParagraphs();
      debugLog(candidates);
      sendResponse({ ok: true, count: candidates.length });
      return true;
    }
    return false;
  });

  console.log("[EN Gloss] content.js ready");
})();
