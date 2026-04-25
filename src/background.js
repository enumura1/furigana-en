// EN Gloss Reader service worker. Minimal lifecycle hook only.
"use strict";

chrome.runtime.onInstalled.addListener(() => {
  console.log("[EN Gloss Reader] installed");
});
