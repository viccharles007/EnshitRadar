import { useSettingsStore } from '@/stores/settingsStore';
import { ExtensionSettings } from '@/types';

console.log('⚙️ Options page loaded');

// Initialize options page when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  await initializeOptions();
});

async function initializeOptions() {
  try {
    // Get store instance
    const settingsStore = useSettingsStore.getState();
    
    // Load settings
    await settingsStore.loadSettings();
    
    // Set up UI
    updateUI();
    setupEventListeners();
    loadStatistics();
    
    console.log('Options page initialized');
  } catch (error) {
    console.error('Failed to initialize options page:', error);
    showMessage('Failed to load settings', 'error');
  }
}

function updateUI() {
  const settings = useSettingsStore.getState().settings;
  const loading = useSettingsStore.getState().loading;
  
  // Update loading state
  document.body.classList.toggle('loading', loading);
  
  // Update form controls
  const enabledToggle = document.getElementById('enabled-toggle') as HTMLInputElement;
  const themeSelect = document.getElementById('theme-select') as HTMLSelectElement;
  const notificationsToggle = document.getElementById('notifications-toggle') as HTMLInputElement;
  
  enabledToggle.checked = settings.enabled;
  themeSelect.value = settings.theme;
  notificationsToggle.checked = settings.notifications;
  
  // Update debug toggle (stored separately)
  loadDebugSetting();
}

function setupEventListeners() {
  // Setting controls
  const enabledToggle = document.getElementById('enabled-toggle') as HTMLInputElement;
  const themeSelect = document.getElementById('theme-select') as HTMLSelectElement;
  const notificationsToggle = document.getElementById('notifications-toggle') as HTMLInputElement;
  const debugToggle = document.getElementById('debug-toggle') as HTMLInputElement;
  
  enabledToggle.addEventListener('change', handleEnabledChange);
  themeSelect.addEventListener('change', handleThemeChange);
  notificationsToggle.addEventListener('change', handleNotificationsChange);
  debugToggle.addEventListener('change', handleDebugChange);
  
  // Action buttons
  const saveButton = document.getElementById('save-button') as HTMLButtonElement;
  const resetButton = document.getElementById('reset-button') as HTMLButtonElement;
  const exportButton = document.getElementById('export-button') as HTMLButtonElement;
  const clearDataButton = document.getElementById('clear-data-button') as HTMLButtonElement;
  
  saveButton.addEventListener('click', handleSave);
  resetButton.addEventListener('click', handleReset);
  exportButton.addEventListener('click', handleExport);
  clearDataButton.addEventListener('click', handleClearData);
  
  // Subscribe to store changes
  useSettingsStore.subscribe(updateUI);
}

async function handleEnabledChange(event: Event) {
  try {
    const checkbox = event.target as HTMLInputElement;
    await useSettingsStore.getState().updateSettings({ enabled: checkbox.checked });
    showMessage('Extension status updated', 'success');
  } catch (error) {
    console.error('Failed to update enabled setting:', error);
    showMessage('Failed to update setting', 'error');
  }
}

async function handleThemeChange(event: Event) {
  try {
    const select = event.target as HTMLSelectElement;
    const theme = select.value as 'light' | 'dark' | 'auto';
    await useSettingsStore.getState().updateSettings({ theme });
    showMessage('Theme updated', 'success');
  } catch (error) {
    console.error('Failed to update theme:', error);
    showMessage('Failed to update theme', 'error');
  }
}

async function handleNotificationsChange(event: Event) {
  try {
    const checkbox = event.target as HTMLInputElement;
    await useSettingsStore.getState().updateSettings({ notifications: checkbox.checked });
    showMessage('Notifications setting updated', 'success');
  } catch (error) {
    console.error('Failed to update notifications:', error);
    showMessage('Failed to update setting', 'error');
  }
}

async function handleDebugChange(event: Event) {
  try {
    const checkbox = event.target as HTMLInputElement;
    await chrome.storage.local.set({ debug: checkbox.checked });
    showMessage('Debug mode updated', 'success');
  } catch (error) {
    console.error('Failed to update debug setting:', error);
    showMessage('Failed to update debug setting', 'error');
  }
}

async function handleSave() {
  try {
    showMessage('Settings saved successfully', 'success');
  } catch (error) {
    console.error('Failed to save settings:', error);
    showMessage('Failed to save settings', 'error');
  }
}

async function handleReset() {
  if (confirm('Are you sure you want to reset all settings to their defaults? This action cannot be undone.')) {
    try {
      await useSettingsStore.getState().resetSettings();
      await chrome.storage.local.remove(['debug', 'statistics']);
      updateUI();
      loadStatistics();
      showMessage('Settings reset to defaults', 'success');
    } catch (error) {
      console.error('Failed to reset settings:', error);
      showMessage('Failed to reset settings', 'error');
    }
  }
}

async function handleExport() {
  try {
    const settings = useSettingsStore.getState().settings;
    const debugResult = await chrome.storage.local.get(['debug']);
    const statisticsResult = await chrome.storage.local.get(['statistics']);
    
    const exportData = {
      settings,
      debug: debugResult.debug || false,
      statistics: statisticsResult.statistics || {},
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `enshit-radar-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showMessage('Settings exported successfully', 'success');
  } catch (error) {
    console.error('Failed to export settings:', error);
    showMessage('Failed to export settings', 'error');
  }
}

async function handleClearData() {
  if (confirm('Are you sure you want to clear all extension data? This will reset everything to defaults and cannot be undone.')) {
    try {
      await chrome.storage.sync.clear();
      await chrome.storage.local.clear();
      await useSettingsStore.getState().resetSettings();
      updateUI();
      loadStatistics();
      showMessage('All data cleared successfully', 'success');
    } catch (error) {
      console.error('Failed to clear data:', error);
      showMessage('Failed to clear data', 'error');
    }
  }
}

async function loadDebugSetting() {
  try {
    const result = await chrome.storage.local.get(['debug']);
    const debugToggle = document.getElementById('debug-toggle') as HTMLInputElement;
    debugToggle.checked = result.debug || false;
  } catch (error) {
    console.error('Failed to load debug setting:', error);
  }
}

async function loadStatistics() {
  try {
    const result = await chrome.storage.local.get(['statistics']);
    const stats = result.statistics || {
      pagesProcessed: 0,
      featuresDetected: 0,
      timeSaved: 0
    };
    
    const pagesElement = document.getElementById('pages-processed') as HTMLElement;
    const featuresElement = document.getElementById('features-detected') as HTMLElement;
    const timeElement = document.getElementById('time-saved') as HTMLElement;
    
    pagesElement.textContent = stats.pagesProcessed.toLocaleString();
    featuresElement.textContent = stats.featuresDetected.toLocaleString();
    timeElement.textContent = `${Math.round(stats.timeSaved / 60)}m`;
  } catch (error) {
    console.error('Failed to load statistics:', error);
  }
}

function showMessage(message: string, type: 'success' | 'error') {
  const messageElement = document.getElementById('status-message') as HTMLElement;
  
  messageElement.textContent = message;
  messageElement.className = `status-message status-${type}`;
  messageElement.style.display = 'block';
  
  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 5000);
} 