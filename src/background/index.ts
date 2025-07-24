// Background service worker for Chrome extension
import { ExtensionMessage, MessageType, ExtensionSettings } from '@/types';
import { setupMessageListener } from '@/utils/messaging';

console.log('🚀 Background service worker loaded');

// Initialize extension on startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Extension startup');
  initializeExtension();
});

// Initialize extension on installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
  initializeExtension();
  
  if (details.reason === 'install') {
    // Open options page on first install
    chrome.runtime.openOptionsPage();
  }
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tab.url);
    // Add any tab-specific logic here
  }
});

// Handle browser action click (if no popup is set)
chrome.action.onClicked.addListener((tab) => {
  console.log('Action clicked for tab:', tab.id);
  // This won't trigger if popup is set in manifest
});

// Set up message handling
setupMessageListener(async (message: ExtensionMessage, sender) => {
  console.log('Background received message:', message.type, message.payload);
  
  switch (message.type) {
    case MessageType.GET_TAB_INFO:
      return await handleGetTabInfo(message.payload?.tabId || sender.tab?.id);
    
    case MessageType.UPDATE_SETTINGS:
      return await handleUpdateSettings(message.payload);
    
    case MessageType.CONTENT_LOADED:
      return await handleContentLoaded(message.payload, sender);
    
    case MessageType.TOGGLE_FEATURE:
      return await handleToggleFeature(message.payload);
    
    default:
      console.warn('Unknown message type:', message.type);
      return { error: 'Unknown message type' };
  }
});

// Initialize extension settings
async function initializeExtension() {
  try {
    const result = await chrome.storage.sync.get(['settings']);
    
    if (!result.settings) {
      const defaultSettings: ExtensionSettings = {
        enabled: true,
        theme: 'auto',
        notifications: true
      };
      
      await chrome.storage.sync.set({ settings: defaultSettings });
      console.log('Default settings initialized');
    }
  } catch (error) {
    console.error('Failed to initialize extension:', error);
  }
}

// Handle get tab info requests
async function handleGetTabInfo(tabId?: number) {
  if (!tabId) {
    return { error: 'No tab ID provided' };
  }
  
  try {
    const tab = await chrome.tabs.get(tabId);
    return {
      id: tab.id,
      url: tab.url,
      title: tab.title,
      active: tab.active
    };
  } catch (error) {
    console.error('Failed to get tab info:', error);
    return { error: 'Failed to get tab info' };
  }
}

// Handle settings updates
async function handleUpdateSettings(settings: ExtensionSettings) {
  try {
    await chrome.storage.sync.set({ settings });
    console.log('Settings updated:', settings);
    
    // Notify all tabs about settings change
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.id) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            type: MessageType.UPDATE_SETTINGS,
            payload: settings
          });
        } catch (error) {
          // Tab might not have content script loaded
          console.debug('Could not send settings to tab:', tab.id, error.message);
        }
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update settings:', error);
    return { error: 'Failed to update settings' };
  }
}

// Handle content script loaded notification
async function handleContentLoaded(payload: any, sender: chrome.runtime.MessageSender) {
  console.log('Content script loaded on:', payload?.url, 'from tab:', sender.tab?.id);
  
  // Send current settings to the newly loaded content script
  try {
    const result = await chrome.storage.sync.get(['settings']);
    if (sender.tab?.id && result.settings) {
      await chrome.tabs.sendMessage(sender.tab.id, {
        type: MessageType.UPDATE_SETTINGS,
        payload: result.settings
      });
    }
  } catch (error) {
    console.error('Failed to send settings to content script:', error);
  }
  
  return { success: true };
}

// Handle feature toggle
async function handleToggleFeature(payload: { enabled: boolean }) {
  console.log('Feature toggled:', payload.enabled);
  
  // Update badge based on feature state
  const badgeText = payload.enabled ? '' : 'OFF';
  const badgeColor: [number, number, number, number] = payload.enabled 
    ? [0, 128, 0, 255] 
    : [128, 128, 128, 255];
  
  try {
    await chrome.action.setBadgeText({ text: badgeText });
    await chrome.action.setBadgeBackgroundColor({ color: badgeColor });
  } catch (error) {
    console.error('Failed to update badge:', error);
  }
  
  return { success: true };
} 