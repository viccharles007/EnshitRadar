// Content script that runs on web pages
import { ExtensionMessage, MessageType, ExtensionSettings, YouTubePageInfo } from '@/types';
import { sendToBackground, setupMessageListener } from '@/utils/messaging';
import { detectYouTubePage, watchForYouTubeChanges } from '@/utils/youtube';
import { channelDatabase } from '@/utils/channelDatabase';
import { WarningBanner, addWarningStyles } from '@/components/WarningBanner';

// Prevent execution in sandboxed frames
if (window.top !== window.self && window.frameElement) {
  console.log('🚫 Skipping execution in iframe');
} else {
  console.log('🌐 Content script loaded on:', window.location.href);
  
  let currentSettings: ExtensionSettings | null = null;
  let currentWarningBanner: WarningBanner | null = null;
  let youtubeObserver: MutationObserver | null = null;

  // Initialize content script
  async function initializeContentScript() {
    try {
      // Load initial settings from storage
      await loadInitialSettings();
      
      // Notify background that content script is loaded
      await sendToBackground(MessageType.CONTENT_LOADED, { url: window.location.href });
      
      // Set up styles for warnings
      addWarningStyles();
      
      // Set up content-specific functionality
      setupPageObserver();
      setupCustomStyles();
      
      // Initialize YouTube detection if on YouTube
      initializeYouTubeDetection();
      
      console.log('Content script initialized with settings:', currentSettings);
    } catch (error) {
      console.error('Failed to initialize content script:', error);
    }
  }

  // Load initial settings from storage
  async function loadInitialSettings() {
    try {
      const result = await chrome.storage.sync.get(['settings']);
      if (result.settings) {
        currentSettings = result.settings;
        console.log('✅ Initial settings loaded:', currentSettings);
      } else {
        // Use default settings if none exist
        currentSettings = { enabled: true };
        console.log('🔧 Using default settings:', currentSettings);
      }
    } catch (error) {
      console.error('❌ Failed to load initial settings:', error);
      // Fallback to default settings
      currentSettings = { enabled: true };
    }
  }

  // Initialize YouTube-specific functionality
  function initializeYouTubeDetection() {
    const pageInfo = detectYouTubePage();
    
    if (!pageInfo.isYouTube) {
      console.log('Not on YouTube, skipping channel detection');
      return;
    }
    
    console.log('🎬 YouTube page detected:', pageInfo);
    
    // Set up observer to watch for page changes (YouTube SPA)
    youtubeObserver = watchForYouTubeChanges((newPageInfo) => {
      console.log('🔄 YouTube page changed:', newPageInfo);
      handleYouTubePageChange(newPageInfo);
    });
  }

  // Handle YouTube page changes
  function handleYouTubePageChange(pageInfo: YouTubePageInfo) {
    // Clear existing warning
    if (currentWarningBanner) {
      currentWarningBanner.remove();
      currentWarningBanner = null;
    }
    
    // Only process channel and video pages
    if (pageInfo.pageType !== 'channel' && pageInfo.pageType !== 'video') {
      return;
    }
    
    // Check if extension is enabled
    if (currentSettings && !currentSettings.enabled) {
      console.log('Extension disabled, skipping warning');
      return;
    }
    
    // If settings haven't loaded yet, skip for now
    if (!currentSettings) {
      console.log('Settings not loaded yet, skipping warning');
      return;
    }
    
    // Try immediately, then retry with delays to handle slow-loading content
    setTimeout(() => checkChannelAndShowWarning(pageInfo), 500);
    setTimeout(() => checkChannelAndShowWarning(pageInfo), 1500);
    setTimeout(() => checkChannelAndShowWarning(pageInfo), 3000);
  }

  // Check channel against database and show warning if needed
  function checkChannelAndShowWarning(pageInfo: YouTubePageInfo) {
    console.log('🔍 Checking channel info:', pageInfo);
    
    if (!pageInfo.channelId && !pageInfo.channelName) {
      console.log('❌ No channel information available');
      return;
    }
    
    // Check if channel is in our database
    const channelRating = channelDatabase.checkChannel(pageInfo.channelId, pageInfo.channelName);
    
    if (!channelRating) {
      console.log('✅ Channel not in database:', pageInfo.channelName, 'ID:', pageInfo.channelId);
      return;
    }
    
    // Check if channel was dismissed for this session
    if (channelRating.channelId && WarningBanner.isChannelDismissed(channelRating.channelId)) {
      console.log('🔇 Channel warning dismissed for session:', channelRating.channelName);
      return;
    }
    
    console.log('⚠️ Flagged channel detected:', channelRating);
    
    // Create and show warning (we already checked pageType above)
    if (pageInfo.pageType === 'channel' || pageInfo.pageType === 'video') {
      showChannelWarning(channelRating, pageInfo.pageType);
    }
  }

  // Show warning banner for flagged channel
  function showChannelWarning(channelRating: any, pageType: 'channel' | 'video') {
    try {
      // Get warning configuration
      const warningConfig = channelDatabase.getWarningConfig(channelRating);
      
      // Create warning banner
      currentWarningBanner = new WarningBanner();
      const bannerElement = currentWarningBanner.create(warningConfig, channelRating);
      
      // Try to insert into page
      const inserted = currentWarningBanner.insertIntoPage(pageType);
      
      if (!inserted) {
        console.warn('Could not find suitable container for warning banner');
        // Fallback: insert at top of body
        document.body.insertBefore(bannerElement, document.body.firstChild);
      }
      
      console.log('✅ Warning banner displayed for:', channelRating.channelName);
      
      // Track warning display
      trackWarningDisplay(channelRating);
      
    } catch (error) {
      console.error('Failed to show channel warning:', error);
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
      
      case MessageType.CLEANUP_SESSION_DATA:
        await handleCleanupSessionData(message.payload);
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
    toggleFeatures(settings.enabled);
  }

  // Handle feature toggle
  async function handleFeatureToggle(payload: { enabled: boolean }) {
    console.log('Feature toggled in content script:', payload.enabled);
    
    // If disabling, cleanup session data immediately
    if (!payload.enabled) {
      console.log('🧹 Extension disabled - cleaning up session data in content script');
      cleanupSessionData();
    }
    
    if (currentSettings) {
      currentSettings.enabled = payload.enabled;
      toggleFeatures(payload.enabled);
    }
  }

  // Handle cleanup session data request
  async function handleCleanupSessionData(payload?: { reason?: string }) {
    console.log('🧹 Cleaning up session data:', payload?.reason || 'unknown reason');
    cleanupSessionData();
  }

  /**
   * Clean up all session storage data
   */
  function cleanupSessionData() {
    try {
      console.log('🧹 Cleaning up EnshitRadar session storage...');
      
      // Remove dismissed channels from session storage
      const dismissedKey = 'enshit-radar-dismissed';
      sessionStorage.removeItem(dismissedKey);
      
      // Remove any other EnshitRadar-related session storage items
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('enshit-radar')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        sessionStorage.removeItem(key);
        console.log(`🗑️ Removed session storage key: ${key}`);
      });
      
      // Remove warning banners if any are currently displayed
      const existingWarnings = document.querySelectorAll('[data-enshit-radar-warning]');
      existingWarnings.forEach(warning => {
        warning.remove();
        console.log('🗑️ Removed warning banner from DOM');
      });
      
      // Clean up current warning banner instance
      if (currentWarningBanner) {
        currentWarningBanner.remove();
        currentWarningBanner = null;
        console.log('🗑️ Removed current warning banner instance');
      }
      
      console.log('✅ Session cleanup completed');
      
    } catch (error) {
      console.error('❌ Failed to cleanup session data:', error);
    }
  }

  /**
   * General cleanup function
   */
  function cleanup() {
    console.log('🧹 General cleanup initiated');
    
    // Remove any displayed warnings
    const existingWarnings = document.querySelectorAll('[data-enshit-radar-warning]');
    existingWarnings.forEach(warning => warning.remove());
    
    // Clean up current warning banner
    if (currentWarningBanner) {
      currentWarningBanner.remove();
      currentWarningBanner = null;
    }
    
    // Stop watching for YouTube changes if we have an observer
    if (youtubeObserver) {
      youtubeObserver.disconnect();
      youtubeObserver = null;
      console.log('🛑 YouTube observer disconnected');
    }
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
    
    // Floating button removed per user request
  }

  // Stop extension features
  function stopFeatures() {
    console.log('Extension features stopped');
    cleanup();
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

  // Track warning display for statistics
  function trackWarningDisplay(channelRating: any) {
    // Send to background for statistics tracking
    sendToBackground(MessageType.CHECK_CHANNEL, {
      channelId: channelRating.channelId,
      channelName: channelRating.channelName
    }).catch(error => {
      console.error('Failed to track warning display:', error);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContentScript);
  } else {
    initializeContentScript();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (youtubeObserver) {
      youtubeObserver.disconnect();
    }
    if (currentWarningBanner) {
      currentWarningBanner.remove();
    }
  });
} 