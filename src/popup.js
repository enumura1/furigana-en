// EN Gloss Reader popup script. Bridges user clicks to the active tab's
// content script and persists settings via chrome.storage.sync.
"use strict";

(function () {
  const errorEl = document.getElementById("error");
  const runBtn = document.getElementById("run");
  const restoreBtn = document.getElementById("restore");
  const autoRunBox = document.getElementById("auto-run");
  const autoRunHostEl = document.getElementById("auto-run-host");
  const autoRunStatusEl = document.getElementById("auto-run-status");

  // Render the on/off state line so the user gets immediate confirmation
  // that the toggle was saved.
  function renderStatus(enabled, supported) {
    if (!autoRunStatusEl) return;
    if (!supported) {
      autoRunStatusEl.textContent = "—";
      autoRunStatusEl.className = "status-off";
      return;
    }
    autoRunStatusEl.textContent = enabled ? "有効" : "無効";
    autoRunStatusEl.className = enabled ? "status-on" : "status-off";
  }

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
    try {
      return new URL(url).protocol !== "https:";
    } catch (_) {
      return true;
    }
  }

  // Send a message to the content script already injected by manifest matches.
  async function sendToContentScript(tabId, msg) {
    return await chrome.tabs.sendMessage(tabId, msg);
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
      showError("この拡張機能は HTTPS ページでのみ利用できます");
      return;
    }
    try {
      await sendToContentScript(tab.id, { type: type });
      window.close();
    } catch (e) {
      showError("ページを再読み込みしてから、もう一度実行してください");
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
      renderStatus(false, false);
    } else {
      try {
        const data = await chrome.storage.sync.get({ siteAutoRun: {} });
        const map = data.siteAutoRun || {};
        autoRunBox.checked = !!map[host];
        renderStatus(autoRunBox.checked, true);
      } catch (_) {
        renderStatus(false, true);
      }
    }

    autoRunBox.addEventListener("change", async () => {
      if (!host) return;
      // Optimistically reflect the new state — storage.sync writes are fast
      // but we don't want the user to wonder whether the click registered.
      renderStatus(autoRunBox.checked, true);
      try {
        const data = await chrome.storage.sync.get({ siteAutoRun: {} });
        const map = (data && data.siteAutoRun) || {};
        if (autoRunBox.checked) {
          map[host] = true;
        } else {
          delete map[host];
        }
        await chrome.storage.sync.set({ siteAutoRun: map });
      } catch (_) {
      }
    });

    runBtn.addEventListener("click", () => dispatch("ENGLOSS_RUN"));
    restoreBtn.addEventListener("click", () => dispatch("ENGLOSS_RESTORE"));
  }

  document.addEventListener("DOMContentLoaded", init);
})();
