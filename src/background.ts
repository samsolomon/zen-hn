/**
 * Background service worker for Zen HN.
 * Handles toolbar icon clicks to toggle the extension on/off.
 */

const ENABLED_STORAGE_KEY = "zenHnEnabled";

async function getEnabled(): Promise<boolean> {
  const result = await chrome.storage.local.get(ENABLED_STORAGE_KEY);
  // Default to enabled if not set
  return result[ENABLED_STORAGE_KEY] !== false;
}

async function setEnabled(enabled: boolean): Promise<void> {
  await chrome.storage.local.set({ [ENABLED_STORAGE_KEY]: enabled });
}

async function updateIcon(enabled: boolean): Promise<void> {
  // Update icon badge to show state
  if (enabled) {
    await chrome.action.setBadgeText({ text: "" });
  } else {
    await chrome.action.setBadgeText({ text: "OFF" });
    await chrome.action.setBadgeBackgroundColor({ color: "#666" });
  }
}

// Handle toolbar icon click
chrome.action.onClicked.addListener(async (tab) => {
  const enabled = await getEnabled();
  const newEnabled = !enabled;
  await setEnabled(newEnabled);
  await updateIcon(newEnabled);

  // Notify content script of the change
  if (tab.id !== undefined) {
    try {
      await chrome.tabs.sendMessage(tab.id, {
        type: "zenHnToggle",
        enabled: newEnabled,
      });
    } catch {
      // Tab might not have content script loaded, reload the page
      chrome.tabs.reload(tab.id);
    }
  }
});

// Set initial icon state on startup
chrome.runtime.onStartup.addListener(async () => {
  const enabled = await getEnabled();
  await updateIcon(enabled);
});

// Set initial icon state on install
chrome.runtime.onInstalled.addListener(async () => {
  const enabled = await getEnabled();
  await updateIcon(enabled);
});
