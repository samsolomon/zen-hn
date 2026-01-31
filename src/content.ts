/**
 * Zen HN Content Script Entry Point
 *
 * This is the main entry point for the bundled content script.
 * It exports icons and utilities that can be used by the extension.
 */

export {
  PHOSPHOR_SVGS,
  HN_HOME_SVG,
  renderIcon,
  registerIcon,
  type IconName,
} from "./icons";

export {
  ACTION_STORE_KEY,
  ACTION_STORE_VERSION,
  ACTION_STORE_DEBOUNCE_MS,
  loadActionStore,
  getCurrentUserKey,
  getStoredAction,
  updateStoredAction,
  isActionStoreLoaded,
  getActionStore,
  type VoteDirection,
  type ActionItem,
  type UserActionBucket,
  type ActionStore,
  type ActionKind,
  type ActionUpdate,
} from "./actionStore";

export {
  type ColorModePreference,
  type ThemePreference,
  COLOR_MODE_CLASS,
  COLOR_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  getSavedColorMode,
  saveColorMode,
  initColorMode,
  listenForSystemColorModeChanges,
  toggleColorMode,
  getColorModeIcon,
  getColorModeLabel,
  parseColorModeFromStorage,
  getSystemPrefersDark,
  getColorModeStorageValue,
  isValidColorModePreference,
  applyColorMode,
  buildColorModeControl,
  buildColorModeControlWithStorage,
  appendColorModeControl,
  getSavedTheme,
  saveTheme,
  applyTheme,
  initTheme,
  buildThemeButtons,
  buildThemeButtonsWithStorage,
  appendThemeButtons,
  appendAppearanceControls,
  styleNativeSelect,
  styleUserPageSelects,
} from "./colorMode";

export {
  SUBMISSION_MENU_CLASS,
  SUBMISSION_MENU_OPEN_CLASS,
  setSubmissionMenuState,
  closeAllSubmissionMenus,
  registerSubmissionMenuListeners,
} from "./submissionMenu";

export {
  RANDOM_ITEM_MAX_ATTEMPTS,
  parseItemIdFromHref,
  parseMaxId,
  fetchNewestItemId,
  resolveHrefWithBase,
  resolveRandomStoryHref,
  handleRandomItemClick,
} from "./random";

export {
  setCollapseButtonState,
  hideDescendantComments,
  restoreDescendantVisibility,
  toggleCommentCollapse,
} from "./commentCollapse";

export {
  resolveFavoriteLink,
  resolveStoryFavoriteLink,
  type FavoriteLinkResult,
} from "./favorites";

export {
  resolveReplyForm,
  resolveReplyFormFromElement,
  submitReplyWithResolved,
  submitReply,
  type ResolvedReplyForm,
  type SubmitResult,
} from "./replyForm";

export { buildSidebarNavigation, runSidebarWhenReady } from "./sidebar";

export {
  buildVoteHref,
  buildCommentHref,
  buildItemHref,
  resolveVoteItemId,
  resolveSubmissionCopyHref,
  toggleVoteState,
  toggleFavoriteState,
  willFavoriteFromHref,
  buildMenuItem,
  buildMenuItems,
  getVoteState,
  buildNextFavoriteHref,
  isUserProfilePage,
  getIndentLevelFromRow,
  getIndentLevelFromItem,
  getCommentId,
  getReplyHref,
  addSubmissionClickHandler,
  addCommentClickHandler,
  type VoteState,
  type MenuItem,
} from "./logic";

// Import everything for globalThis exposure
import {
  PHOSPHOR_SVGS,
  HN_HOME_SVG,
  renderIcon,
  registerIcon,
} from "./icons";

import {
  ACTION_STORE_KEY,
  ACTION_STORE_VERSION,
  ACTION_STORE_DEBOUNCE_MS,
  loadActionStore,
  getCurrentUserKey,
  getStoredAction,
  updateStoredAction,
  isActionStoreLoaded,
  getActionStore,
} from "./actionStore";

import {
  COLOR_MODE_CLASS,
  COLOR_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  getSavedColorMode,
  saveColorMode,
  initColorMode,
  listenForSystemColorModeChanges,
  toggleColorMode,
  getColorModeIcon,
  getColorModeLabel,
  parseColorModeFromStorage,
  getSystemPrefersDark,
  getColorModeStorageValue,
  isValidColorModePreference,
  applyColorMode,
  buildColorModeControl,
  buildColorModeControlWithStorage,
  appendColorModeControl,
  getSavedTheme,
  saveTheme,
  applyTheme,
  initTheme,
  buildThemeButtons,
  buildThemeButtonsWithStorage,
  appendThemeButtons,
  appendAppearanceControls,
  styleNativeSelect,
  styleUserPageSelects,
} from "./colorMode";

import {
  SUBMISSION_MENU_CLASS,
  SUBMISSION_MENU_OPEN_CLASS,
  setSubmissionMenuState,
  closeAllSubmissionMenus,
  registerSubmissionMenuListeners,
} from "./submissionMenu";

import {
  RANDOM_ITEM_MAX_ATTEMPTS,
  parseItemIdFromHref,
  parseMaxId,
  fetchNewestItemId,
  resolveHrefWithBase,
  resolveRandomStoryHref,
  handleRandomItemClick,
} from "./random";

import {
  buildVoteHref,
  buildCommentHref,
  buildItemHref,
  resolveVoteItemId,
  resolveSubmissionCopyHref,
  toggleVoteState,
  toggleFavoriteState,
  willFavoriteFromHref,
  buildMenuItem,
  buildMenuItems,
  getVoteState,
  buildNextFavoriteHref,
  isUserProfilePage,
  getIndentLevelFromRow,
  getIndentLevelFromItem,
  getCommentId,
  getReplyHref,
  addSubmissionClickHandler,
  addCommentClickHandler,
} from "./logic";

import {
  setCollapseButtonState,
  hideDescendantComments,
  restoreDescendantVisibility,
  toggleCommentCollapse,
} from "./commentCollapse";

import {
  resolveFavoriteLink,
  resolveStoryFavoriteLink,
} from "./favorites";

import {
  resolveReplyForm,
  resolveReplyFormFromElement,
  submitReplyWithResolved,
  submitReply,
} from "./replyForm";

import {
  buildSidebarNavigation,
  runSidebarWhenReady,
} from "./sidebar";

// Expose on globalThis for content.js to access
(globalThis as Record<string, unknown>).ZenHnIcons = {
  PHOSPHOR_SVGS,
  HN_HOME_SVG,
  renderIcon,
  registerIcon,
};

(globalThis as Record<string, unknown>).ZenHnColorMode = {
  COLOR_MODE_CLASS,
  COLOR_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  getSavedColorMode,
  saveColorMode,
  initColorMode,
  listenForSystemColorModeChanges,
  toggleColorMode,
  getColorModeIcon,
  getColorModeLabel,
  parseColorModeFromStorage,
  getSystemPrefersDark,
  getColorModeStorageValue,
  isValidColorModePreference,
  applyColorMode,
  buildColorModeControl,
  buildColorModeControlWithStorage,
  appendColorModeControl,
  getSavedTheme,
  saveTheme,
  applyTheme,
  initTheme,
  buildThemeButtons,
  buildThemeButtonsWithStorage,
  appendThemeButtons,
  appendAppearanceControls,
  styleNativeSelect,
  styleUserPageSelects,
};

(globalThis as Record<string, unknown>).ZenHnActionStore = {
  ACTION_STORE_KEY,
  ACTION_STORE_VERSION,
  ACTION_STORE_DEBOUNCE_MS,
  loadActionStore,
  getCurrentUserKey,
  getStoredAction,
  updateStoredAction,
  isActionStoreLoaded,
  getActionStore,
};

(globalThis as Record<string, unknown>).ZenHnSubmissionMenu = {
  SUBMISSION_MENU_CLASS,
  SUBMISSION_MENU_OPEN_CLASS,
  setSubmissionMenuState,
  closeAllSubmissionMenus,
  registerSubmissionMenuListeners,
};

(globalThis as Record<string, unknown>).ZenHnRandom = {
  RANDOM_ITEM_MAX_ATTEMPTS,
  parseItemIdFromHref,
  parseMaxId,
  fetchNewestItemId,
  resolveHrefWithBase,
  resolveRandomStoryHref,
  handleRandomItemClick,
};

(globalThis as Record<string, unknown>).ZenHnCommentCollapse = {
  setCollapseButtonState,
  hideDescendantComments,
  restoreDescendantVisibility,
  toggleCommentCollapse,
};

(globalThis as Record<string, unknown>).ZenHnFavorites = {
  resolveFavoriteLink,
  resolveStoryFavoriteLink,
};

(globalThis as Record<string, unknown>).ZenHnReplyForm = {
  resolveReplyForm,
  resolveReplyFormFromElement,
  submitReplyWithResolved,
  submitReply,
};

(globalThis as Record<string, unknown>).ZenHnSidebar = {
  buildSidebarNavigation,
  runSidebarWhenReady,
};

(globalThis as Record<string, unknown>).ZenHnLogic = {
  buildVoteHref,
  buildCommentHref,
  buildItemHref,
  resolveVoteItemId,
  resolveSubmissionCopyHref,
  toggleVoteState,
  toggleFavoriteState,
  willFavoriteFromHref,
  buildMenuItem,
  buildMenuItems,
  getVoteState,
  buildNextFavoriteHref,
  isUserProfilePage,
  getIndentLevelFromRow,
  getIndentLevelFromItem,
  getCommentId,
  getReplyHref,
  addSubmissionClickHandler,
  addCommentClickHandler,
};
