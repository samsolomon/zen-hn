/**
 * Background service worker for Zen HN.
 * Handles toolbar icon clicks to toggle the extension on/off.
 */

const ENABLED_STORAGE_KEY = "zenHnEnabled";
const EXTERNAL_ESCAPE_STORAGE_KEY = "zenHnExternalEscape";
const EXTERNAL_SCRIPT_ID = "zenHnExternalSiteEscape";

// Host permissions for external sites
const EXTERNAL_HOST_PERMISSIONS = {
  origins: ["https://*/*", "http://*/*"],
};

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

  // Always reload HN tabs to apply the change cleanly
  if (tab.id !== undefined && tab.url?.includes("news.ycombinator.com")) {
    chrome.tabs.reload(tab.id);
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

  // Check if external escape was enabled and re-register the script
  await syncExternalScriptWithPermissions();
});

// =============================================================================
// External Site Escape Feature
// =============================================================================

/**
 * Check if external site escape is enabled in storage
 */
async function getExternalEscapeEnabled(): Promise<boolean> {
  const result = await chrome.storage.local.get(EXTERNAL_ESCAPE_STORAGE_KEY);
  return result[EXTERNAL_ESCAPE_STORAGE_KEY] === true;
}

/**
 * Save external escape preference to storage
 */
async function setExternalEscapeEnabled(enabled: boolean): Promise<void> {
  await chrome.storage.local.set({ [EXTERNAL_ESCAPE_STORAGE_KEY]: enabled });
}

/**
 * Check if we have the external host permissions
 */
async function hasExternalHostPermissions(): Promise<boolean> {
  return chrome.permissions.contains(EXTERNAL_HOST_PERMISSIONS);
}

/**
 * Request external host permissions from the user
 */
async function requestExternalSitePermissions(): Promise<boolean> {
  try {
    const granted = await chrome.permissions.request(EXTERNAL_HOST_PERMISSIONS);
    return granted;
  } catch {
    return false;
  }
}

/**
 * Revoke external host permissions
 */
async function revokeExternalSitePermissions(): Promise<boolean> {
  try {
    const removed = await chrome.permissions.remove(EXTERNAL_HOST_PERMISSIONS);
    return removed;
  } catch {
    return false;
  }
}

/**
 * Check if the external site script is already registered
 */
async function isExternalScriptRegistered(): Promise<boolean> {
  try {
    const scripts = await chrome.scripting.getRegisteredContentScripts({
      ids: [EXTERNAL_SCRIPT_ID],
    });
    return scripts.length > 0;
  } catch {
    return false;
  }
}

/**
 * Register the external site escape content script
 */
async function registerExternalSiteScript(): Promise<void> {
  try {
    // Check if already registered to avoid duplicate ID error
    const alreadyRegistered = await isExternalScriptRegistered();
    if (alreadyRegistered) {
      return;
    }

    await chrome.scripting.registerContentScripts([
      {
        id: EXTERNAL_SCRIPT_ID,
        matches: ["https://*/*", "http://*/*"],
        excludeMatches: [
          "https://news.ycombinator.com/*",
          "http://news.ycombinator.com/*",
        ],
        js: ["dist/externalSiteEscape.js"],
        runAt: "document_idle",
      },
    ]);
  } catch (error) {
    // Log but don't throw - registration may have failed for various reasons
    console.error("Failed to register external site script:", error);
  }
}

/**
 * Unregister the external site escape content script
 */
async function unregisterExternalSiteScript(): Promise<void> {
  try {
    await chrome.scripting.unregisterContentScripts({
      ids: [EXTERNAL_SCRIPT_ID],
    });
  } catch {
    // Script may not exist, ignore
  }
}

/**
 * Sync the external site script registration with current permissions
 */
async function syncExternalScriptWithPermissions(): Promise<void> {
  const hasPermissions = await hasExternalHostPermissions();
  const isEnabled = await getExternalEscapeEnabled();

  if (hasPermissions && isEnabled) {
    await registerExternalSiteScript();
  } else {
    await unregisterExternalSiteScript();
    // If permissions were revoked externally, update storage
    if (!hasPermissions && isEnabled) {
      await setExternalEscapeEnabled(false);
    }
  }
}

/**
 * Toggle external escape feature
 */
async function toggleExternalEscape(
  enable: boolean
): Promise<{ success: boolean; enabled: boolean }> {
  if (enable) {
    // Request permissions
    const granted = await requestExternalSitePermissions();
    if (granted) {
      await setExternalEscapeEnabled(true);
      await registerExternalSiteScript();
      return { success: true, enabled: true };
    } else {
      return { success: false, enabled: false };
    }
  } else {
    // Revoke permissions and unregister script
    await revokeExternalSitePermissions();
    await setExternalEscapeEnabled(false);
    await unregisterExternalSiteScript();
    return { success: true, enabled: false };
  }
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "escapeToHN") {
    // Navigate back in the current tab
    chrome.tabs.goBack();
    return false;
  }

  if (message.type === "toggleExternalEscape") {
    toggleExternalEscape(message.enable).then(sendResponse);
    return true; // Keep channel open for async response
  }

  if (message.type === "getExternalEscapeStatus") {
    Promise.all([hasExternalHostPermissions(), getExternalEscapeEnabled()]).then(
      ([hasPermissions, isEnabled]) => {
        sendResponse({ enabled: hasPermissions && isEnabled });
      }
    );
    return true; // Keep channel open for async response
  }

  return false;
});

// Listen for permission changes
chrome.permissions.onAdded.addListener(async (permissions) => {
  if (
    permissions.origins?.some(
      (origin) => origin === "https://*/*" || origin === "http://*/*"
    )
  ) {
    await syncExternalScriptWithPermissions();
  }
});

chrome.permissions.onRemoved.addListener(async (permissions) => {
  if (
    permissions.origins?.some(
      (origin) => origin === "https://*/*" || origin === "http://*/*"
    )
  ) {
    await syncExternalScriptWithPermissions();
  }
});
