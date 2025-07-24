// Content script that runs on web pages
import { ExtensionMessage, MessageType, ExtensionSettings } from '@/types';
import { sendToBackground, setupMessageListener } from '@/utils/messaging';

console.log('🌐 Content script loaded on:', window.location.href);

let currentSettings: ExtensionSettings | null = null;

// Initialize content script
async function initializeContentScript() {
  try {
    // Notify background that content script is loaded
    await sendToBackground(MessageType.CONTENT_LOADED, { url: window.location.href });
    
    // Set up content-specific functionality
    setupPageObserver();
    setupCustomStyles();
    
    console.log('Content script initialized');
  } catch (error) {
    console.error('Failed to initialize content script:', error);
  }
}

// Set up message listener for communication with background/popup
setupMessageListener(async (message: ExtensionMessage) => {
  console.log('Content received message:', message.type, message.payload);
  
  switch (message.type) {
    case MessageType.UPDATE_SETTINGS:
      await handleSettingsUpdate(message.payload);
      return { success: true };
    
    case MessageType.TOGGLE_FEATURE:
      await handleFeatureToggle(message.payload);
      return { success: true };
    
    default:
      console.warn('Unknown message type in content script:', message.type);
      return { error: 'Unknown message type' };
  }
});

// Handle settings updates from background
async function handleSettingsUpdate(settings: ExtensionSettings) {
  currentSettings = settings;
  console.log('Settings updated in content script:', settings);
  
  // Apply settings to the page
  applyTheme(settings.theme);
  toggleFeatures(settings.enabled);
}

// Handle feature toggle
async function handleFeatureToggle(payload: { enabled: boolean }) {
  console.log('Feature toggled in content script:', payload.enabled);
  
  if (currentSettings) {
    currentSettings.enabled = payload.enabled;
    toggleFeatures(payload.enabled);
  }
}

// Apply theme to the page
function applyTheme(theme: 'light' | 'dark' | 'auto') {
  const body = document.body;
  
  // Remove existing theme classes
  body.classList.remove('extension-light', 'extension-dark', 'extension-auto');
  
  // Apply new theme
  body.classList.add(`extension-${theme}`);
  
  console.log('Theme applied:', theme);
}

// Toggle extension features on/off
function toggleFeatures(enabled: boolean) {
  const body = document.body;
  
  if (enabled) {
    body.classList.add('extension-enabled');
    body.classList.remove('extension-disabled');
    startFeatures();
  } else {
    body.classList.add('extension-disabled');
    body.classList.remove('extension-enabled');
    stopFeatures();
  }
  
  console.log('Features toggled:', enabled);
}

// Start extension features
function startFeatures() {
  // Add your main extension functionality here
  console.log('Extension features started');
  
  // Example: Add a floating button
  addFloatingButton();
}

// Stop extension features
function stopFeatures() {
  console.log('Extension features stopped');
  
  // Example: Remove floating button
  removeFloatingButton();
}

// Set up page observer for dynamic content
function setupPageObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Handle dynamically added content
        handleDynamicContent(mutation.addedNodes);
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('Page observer set up');
}

// Handle dynamically added content
function handleDynamicContent(nodes: NodeList) {
  nodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      
      // Add your dynamic content handling logic here
      console.log('Dynamic content detected:', element.tagName);
    }
  });
}

// Set up custom styles
function setupCustomStyles() {
  const styleId = 'extension-custom-styles';
  
  // Remove existing styles
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Add new styles
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .extension-floating-button {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      z-index: 10000;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }
    
    .extension-floating-button:hover {
      background: #0056b3;
      transform: scale(1.1);
    }
    
    .extension-disabled .extension-floating-button {
      opacity: 0.5;
      pointer-events: none;
    }
    
    .extension-dark {
      filter: invert(1) hue-rotate(180deg);
    }
    
    .extension-dark img,
    .extension-dark video,
    .extension-dark iframe {
      filter: invert(1) hue-rotate(180deg);
    }
  `;
  
  document.head.appendChild(style);
  console.log('Custom styles applied');
}

// Add floating button example
function addFloatingButton() {
  const existingButton = document.getElementById('extension-floating-button');
  if (existingButton) return;
  
  const button = document.createElement('button');
  button.id = 'extension-floating-button';
  button.className = 'extension-floating-button';
  button.innerHTML = '🔍';
  button.title = 'EnshitRadar';
  
  button.addEventListener('click', () => {
    console.log('Floating button clicked');
    // Add your click handler logic here
    alert('EnshitRadar extension is active!');
  });
  
  document.body.appendChild(button);
}

// Remove floating button
function removeFloatingButton() {
  const button = document.getElementById('extension-floating-button');
  if (button) {
    button.remove();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeContentScript);
} else {
  initializeContentScript();
} 