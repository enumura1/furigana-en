// EN Gloss Reader popup script. Bridges user clicks to the active tab's
// content script and persists settings via chrome.storage.sync.
"use strict";

(function () {
  const errorEl = document.getElementById("error");
  const runBtn = document.getElementById("run");
  const restoreBtn = document.getElementById("restore");
  const autoRunBox = document.getElementById("auto-run");
  const autoRunHostEl = document.getElementById("auto-run-host");

  // Show the inline error banner at the top of the popup.
  function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }

  // Clear the inline error banner.
  function clearError() {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
  }

  // Read the active tab in the current window. activeTab permission scopes this
  // to just the tab the user is currently looking at.
  async function getActiveTab() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0] || null;
  }

  // Pages where content scripts cannot run.
  function isUnsupportedUrl(url) {
    if (!url) return true;
    if (url === "about:blank") return true;
    return /^(chrome|chrome-extension|edge|about|view-source|file|devtools):/i.test(url);
  }

  // Send a message to the tab's content script. If the script was never
  // injected (e.g. the tab pre-existed extension install), inject it once
  // via chrome.scripting and retry.
  async function sendWithReinject(tabId, msg) {
    try {
      return await chrome.tabs.sendMessage(tabId, msg);
    } catch (_) {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["src/content.js"],
      });
      return await chrome.tabs.sendMessage(tabId, msg);
    }
  }

  // Common dispatcher for run / restore buttons.
  async function dispatch(type) {
    clearError();
    let tab;
    try {
      tab = await getActiveTab();
    } catch (e) {
      showError("タブの取得に失敗しました: " + (e && e.message ? e.message : e));
      return;
    }
    if (!tab || typeof tab.id !== "number") {
      showError("アクティブなタブが見つかりません");
      return;
    }
    if (isUnsupportedUrl(tab.url)) {
      showError("このページでは利用できません（chrome:// など）");
      return;
    }
    try {
      await sendWithReinject(tab.id, { type: type });
      window.close();
    } catch (e) {
      showError("コンテンツスクリプトに接続できません: " + (e && e.message ? e.message : e));
    }
  }

  // Pull the host from a tab URL; null on unsupported / unparseable URLs.
  function hostFromTab(tab) {
    if (!tab || !tab.url || isUnsupportedUrl(tab.url)) return null;
    try {
      return new URL(tab.url).host || null;
    } catch (_) {
      return null;
    }
  }

  // Initialize: resolve the active tab's host, hydrate the per-host auto-run
  // toggle, and wire handlers.
  async function init() {
    let tab = null;
    try {
      tab = await getActiveTab();
    } catch (_) { /* surfaced when buttons are pressed */ }
    const host = hostFromTab(tab);

    autoRunHostEl.textContent = host || "(このページでは設定できません)";

    if (!host) {
      autoRunBox.checked = false;
      autoRunBox.disabled = true;
    } else {
      try {
        const data = await chrome.storage.sync.get({ siteAutoRun: {} });
        const map = data.siteAutoRun || {};
        autoRunBox.checked = !!map[host];
      } catch (e) {
        console.error("[EN Gloss popup] storage read failed", e);
      }
    }

    autoRunBox.addEventListener("change", async () => {
      if (!host) return;
      try {
        const data = await chrome.storage.sync.get({ siteAutoRun: {} });
        const map = (data && data.siteAutoRun) || {};
        if (autoRunBox.checked) {
          map[host] = true;
        } else {
          delete map[host];
        }
        await chrome.storage.sync.set({ siteAutoRun: map });
      } catch (e) {
        console.error("[EN Gloss popup] storage write failed", e);
      }
    });

    runBtn.addEventListener("click", () => dispatch("ENGLOSS_RUN"));
    restoreBtn.addEventListener("click", () => dispatch("ENGLOSS_RESTORE"));
  }

  document.addEventListener("DOMContentLoaded", init);
})();
