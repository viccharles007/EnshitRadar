import { useSettingsStore } from '@/stores/settingsStore';
import { sendToBackground, getCurrentTab } from '@/utils/messaging';
import { MessageType } from '@/types';
import { channelDatabase } from '@/utils/channelDatabase';

console.log('🔧 Popup script loaded');

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  await initializePopup();
});

async function initializePopup() {
  try {
    // Get store instance
    const settingsStore = useSettingsStore.getState();
    
    // Load settings
    await settingsStore.loadSettings();
    
    // Set up UI
    updateUI();
    setupEventListeners();
    
    console.log('Popup initialized');
  } catch (error) {
    console.error('Failed to initialize popup:', error);
    showError('Failed to load extension');
  }
}

function updateUI() {
  const settings = useSettingsStore.getState().settings;
  const loading = useSettingsStore.getState().loading;
  
  // Update loading state
  document.body.classList.toggle('loading', loading);
  
  // Update status indicator
  const statusIndicator = document.getElementById('status-indicator') as HTMLElement;
  const statusDot = document.getElementById('status-dot') as HTMLElement;
  const statusText = document.getElementById('status-text') as HTMLElement;
  
  if (settings.enabled) {
    statusIndicator.className = 'status-indicator status-enabled';
    statusDot.className = 'status-dot dot-enabled';
    statusText.textContent = 'Extension is active';
  } else {
    statusIndicator.className = 'status-indicator status-disabled';
    statusDot.className = 'status-dot dot-disabled';
    statusText.textContent = 'Extension is disabled';
  }
  
  // Update toggle button
  const toggleButton = document.getElementById('toggle-button') as HTMLButtonElement;
  const toggleText = document.getElementById('toggle-text') as HTMLElement;
  
  if (settings.enabled) {
    toggleButton.className = 'toggle-button toggle-enabled';
    toggleText.textContent = 'Disable Extension';
  } else {
    toggleButton.className = 'toggle-button toggle-disabled';
    toggleText.textContent = 'Enable Extension';
  }
  
  // Update database stats
  updateDatabaseStats();
}

function setupEventListeners() {
  // Toggle button
  const toggleButton = document.getElementById('toggle-button') as HTMLButtonElement;
  toggleButton.addEventListener('click', handleToggle);
  
  // Footer links
  const optionsLink = document.getElementById('options-link') as HTMLAnchorElement;
  optionsLink.addEventListener('click', handleOptionsClick);
  
  const helpLink = document.getElementById('help-link') as HTMLAnchorElement;
  helpLink.addEventListener('click', handleHelpClick);
  
  const discordLink = document.getElementById('discord-link') as HTMLAnchorElement;
  discordLink.addEventListener('click', handleDiscordClick);
  
  const youtubeLink = document.getElementById('youtube-link') as HTMLAnchorElement;
  youtubeLink.addEventListener('click', handleYouTubeClick);
  
  // Subscribe to store changes
  useSettingsStore.subscribe(updateUI);
}

async function handleToggle() {
  try {
    const currentSettings = useSettingsStore.getState().settings;
    const newEnabled = !currentSettings.enabled;
    
    // If disabling, cleanup session data first
    if (!newEnabled) {
      console.log('🧹 Extension being disabled - cleaning up session data');
      await cleanupSessionDataAllTabs();
    }
    
    // Update settings
    await useSettingsStore.getState().updateSettings({ enabled: newEnabled });
    
    // Notify background script
    await sendToBackground(MessageType.TOGGLE_FEATURE, { enabled: newEnabled });
    
    // Get current tab and notify content script
    const tab = await getCurrentTab();
    if (tab.id) {
      await chrome.tabs.sendMessage(tab.id, {
        type: MessageType.TOGGLE_FEATURE,
        payload: { enabled: newEnabled }
      });
    }
    
    console.log('Extension toggled:', newEnabled);
  } catch (error) {
    console.error('Failed to toggle extension:', error);
    showError('Failed to toggle extension');
  }
}

async function cleanupSessionDataAllTabs() {
  try {
    const tabs = await chrome.tabs.query({});
    const cleanupPromises = tabs.map(async (tab) => {
      if (tab.id) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            type: MessageType.CLEANUP_SESSION_DATA,
            payload: { reason: 'extension_toggle_off' }
          });
        } catch (error) {
          // Tab might not have content script loaded
          console.debug('Could not send cleanup message to tab:', tab.id);
        }
      }
    });
    
    await Promise.allSettled(cleanupPromises);
    console.log('✅ Session cleanup sent to all tabs');
  } catch (error) {
    console.error('❌ Failed to cleanup session data:', error);
  }
}



function handleOptionsClick(event: Event) {
  event.preventDefault();
  chrome.runtime.openOptionsPage();
  window.close();
}

function handleHelpClick(event: Event) {
  event.preventDefault();
  // Open help page or documentation
  chrome.tabs.create({ url: 'https://github.com/justmadlime/EnshitRadar#readme' });
  window.close();
}

function handleDiscordClick(event: Event) {
  event.preventDefault();
  // Open Discord server
  chrome.tabs.create({ url: 'https://discord.gg/brCNpJcx' });
  window.close();
}

function handleYouTubeClick(event: Event) {
  event.preventDefault();
  // Open YouTube channel
  chrome.tabs.create({ url: 'https://www.youtube.com/@justmadlime' });
  window.close();
}

function updateDatabaseStats() {
  try {
    const stats = channelDatabase.getStatistics();
    const totalChannels = channelDatabase.getTotalChannels();
    
    // Update total channels
    const totalElement = document.getElementById('total-channels') as HTMLElement;
    totalElement.textContent = totalChannels.toString();
    
    // Update individual counts
    const lowElement = document.getElementById('low-count') as HTMLElement;
    const middleElement = document.getElementById('middle-count') as HTMLElement;
    const highElement = document.getElementById('high-count') as HTMLElement;
    const confirmedElement = document.getElementById('confirmed-count') as HTMLElement;
    
    lowElement.textContent = stats.low.toString();
    middleElement.textContent = stats.middle.toString();
    highElement.textContent = stats.high.toString();
    confirmedElement.textContent = stats.confirmed.toString();
    
    // Show stats section
    const statsSection = document.getElementById('database-stats') as HTMLElement;
    statsSection.style.display = 'block';
    
  } catch (error) {
    console.error('Failed to update database stats:', error);
  }
}

function showError(message: string) {
  const statusText = document.getElementById('status-text') as HTMLElement;
  statusText.textContent = message;
  statusText.style.color = '#dc3545';
  
  setTimeout(() => {
    updateUI();
  }, 3000);
} 