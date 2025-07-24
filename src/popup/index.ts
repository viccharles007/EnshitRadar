import { useSettingsStore } from '@/stores/settingsStore';
import { sendToBackground, getCurrentTab } from '@/utils/messaging';
import { MessageType } from '@/types';

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
  
  // Update settings controls
  const themeSelect = document.getElementById('theme-select') as HTMLSelectElement;
  const notificationsCheckbox = document.getElementById('notifications-checkbox') as HTMLInputElement;
  
  themeSelect.value = settings.theme;
  notificationsCheckbox.checked = settings.notifications;
}

function setupEventListeners() {
  // Toggle button
  const toggleButton = document.getElementById('toggle-button') as HTMLButtonElement;
  toggleButton.addEventListener('click', handleToggle);
  
  // Theme select
  const themeSelect = document.getElementById('theme-select') as HTMLSelectElement;
  themeSelect.addEventListener('change', handleThemeChange);
  
  // Notifications checkbox
  const notificationsCheckbox = document.getElementById('notifications-checkbox') as HTMLInputElement;
  notificationsCheckbox.addEventListener('change', handleNotificationsChange);
  
  // Footer links
  const optionsLink = document.getElementById('options-link') as HTMLAnchorElement;
  optionsLink.addEventListener('click', handleOptionsClick);
  
  const helpLink = document.getElementById('help-link') as HTMLAnchorElement;
  helpLink.addEventListener('click', handleHelpClick);
  
  // Subscribe to store changes
  useSettingsStore.subscribe(updateUI);
}

async function handleToggle() {
  try {
    const currentSettings = useSettingsStore.getState().settings;
    const newEnabled = !currentSettings.enabled;
    
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

async function handleThemeChange(event: Event) {
  try {
    const select = event.target as HTMLSelectElement;
    const theme = select.value as 'light' | 'dark' | 'auto';
    
    await useSettingsStore.getState().updateSettings({ theme });
    
    console.log('Theme changed:', theme);
  } catch (error) {
    console.error('Failed to change theme:', error);
    showError('Failed to change theme');
  }
}

async function handleNotificationsChange(event: Event) {
  try {
    const checkbox = event.target as HTMLInputElement;
    const notifications = checkbox.checked;
    
    await useSettingsStore.getState().updateSettings({ notifications });
    
    console.log('Notifications changed:', notifications);
  } catch (error) {
    console.error('Failed to change notifications:', error);
    showError('Failed to change notifications setting');
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
  chrome.tabs.create({ url: 'https://github.com/yourusername/enshit-radar#readme' });
  window.close();
}

function showError(message: string) {
  const statusText = document.getElementById('status-text') as HTMLElement;
  statusText.textContent = message;
  statusText.style.color = '#dc3545';
  
  setTimeout(() => {
    updateUI();
  }, 3000);
} 