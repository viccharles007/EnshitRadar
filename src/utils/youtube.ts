import { YouTubePageInfo } from '@/types';

/**
 * Detect if current page is YouTube and extract page information
 */
export function detectYouTubePage(): YouTubePageInfo {
  const url = window.location.href;
  const hostname = window.location.hostname;
  
  // Check if we're on YouTube
  const isYouTube = hostname === 'www.youtube.com' || hostname === 'youtube.com' || hostname === 'm.youtube.com';
  
  if (!isYouTube) {
    return {
      isYouTube: false,
      pageType: 'other'
    };
  }
  
  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  
  // Detect page type and extract information
  if (pathname.startsWith('/channel/') || pathname.startsWith('/c/') || pathname.startsWith('/@')) {
    // Channel page
    const channelInfo = extractChannelInfo();
    return {
      isYouTube: true,
      pageType: 'channel',
      channelId: channelInfo.channelId,
      channelName: channelInfo.channelName,
      channelUrl: url
    };
  } else if (pathname === '/watch' && searchParams.has('v')) {
    // Video page
    const videoId = searchParams.get('v');
    const channelInfo = extractChannelInfoFromVideo();
    return {
      isYouTube: true,
      pageType: 'video',
      videoId: videoId || undefined,
      channelId: channelInfo.channelId,
      channelName: channelInfo.channelName,
      channelUrl: channelInfo.channelUrl
    };
  }
  
  return {
    isYouTube: true,
    pageType: 'other'
  };
}

/**
 * Extract channel information from channel page
 */
function extractChannelInfo(): { channelId?: string; channelName?: string } {
  const pathname = window.location.pathname;
  
  // Try to get channel ID from URL
  let channelId: string | undefined;
  if (pathname.startsWith('/channel/')) {
    channelId = pathname.split('/channel/')[1]?.split('/')[0];
  }
  
  // Try to get channel name from page elements
  let channelName: string | undefined;
  
  // Try multiple selectors for channel name
  const nameSelectors = [
    'yt-formatted-string#text.style-scope.ytd-channel-name',
    '#channel-header-container #text',
    '.ytd-channel-name #text',
    'yt-formatted-string.ytd-channel-name',
    '[id="channel-name"] yt-formatted-string'
  ];
  
  for (const selector of nameSelectors) {
    const element = document.querySelector(selector);
    if (element?.textContent?.trim()) {
      channelName = element.textContent.trim();
      break;
    }
  }
  
  // Fallback: try to get from page title
  if (!channelName) {
    const title = document.title;
    if (title && title.includes(' - YouTube')) {
      channelName = title.replace(' - YouTube', '').trim();
    }
  }
  
  return { channelId, channelName };
}

/**
 * Extract channel information from video page
 */
function extractChannelInfoFromVideo(): { channelId?: string; channelName?: string; channelUrl?: string } {
  let channelId: string | undefined;
  let channelName: string | undefined;
  let channelUrl: string | undefined;
  
  // Try to get channel link element
  const channelLinkSelectors = [
    '.ytd-video-owner-renderer .yt-simple-endpoint[href*="/channel/"]',
    '.ytd-video-owner-renderer .yt-simple-endpoint[href*="/@"]',
    '.ytd-video-owner-renderer .yt-simple-endpoint[href*="/c/"]',
    '.ytd-video-owner-renderer .yt-simple-endpoint[href*="/user/"]',
    '#upload-info #channel-name a',
    '.ytd-channel-name a',
    'a[href*="/channel/"]',
    'a[href*="/@"]',
    'a[href*="/c/"]',
    'a[href*="/user/"]',
    '#owner-sub-count + .yt-simple-endpoint.style-scope.yt-formatted-string'
  ];
  
  let channelLinkElement: Element | null = null;
  for (const selector of channelLinkSelectors) {
    channelLinkElement = document.querySelector(selector);
    if (channelLinkElement) break;
  }
  
  if (channelLinkElement) {
    const href = channelLinkElement.getAttribute('href');
    if (href) {
      channelUrl = href.startsWith('/') ? `https://www.youtube.com${href}` : href;
      
      // Extract channel ID from URL
      if (href.includes('/channel/')) {
        channelId = href.split('/channel/')[1]?.split('/')[0];
      } else if (href.includes('/c/')) {
        // Custom channel URL - we'll use the custom name as a fallback ID
        const customName = href.split('/c/')[1]?.split('/')[0];
        channelId = customName ? `custom_${customName}` : undefined;
      } else if (href.includes('/user/')) {
        // Legacy user URL
        const userName = href.split('/user/')[1]?.split('/')[0];
        channelId = userName ? `user_${userName}` : undefined;
      } else if (href.startsWith('/@')) {
        // Handle new @username format
        const handleName = href.split('/@')[1]?.split('/')[0];
        channelId = handleName ? `handle_${handleName}` : undefined;
      }
    }
    
    // Get channel name from link text
    channelName = channelLinkElement.textContent?.trim();
  }
  
  // Alternative method: look for channel name in video metadata
  if (!channelName) {
    const nameSelectors = [
      '.ytd-video-owner-renderer .ytd-channel-name yt-formatted-string',
      '#upload-info #channel-name .yt-simple-endpoint',
      '.ytd-channel-name .yt-simple-endpoint',
      '.ytd-video-owner-renderer .yt-formatted-string',
      '#channel-name .yt-formatted-string',
      '[id="channel-name"] a',
      '.ytd-channel-name span'
    ];
    
    for (const selector of nameSelectors) {
      const element = document.querySelector(selector);
      if (element?.textContent?.trim()) {
        channelName = element.textContent.trim();
        break;
      }
    }
  }
  
  // Try to get from URL parameter as fallback
  if (!channelName) {
    const urlParams = new URLSearchParams(window.location.search);
    const abChannel = urlParams.get('ab_channel');
    if (abChannel) {
      channelName = decodeURIComponent(abChannel).replace(/–/g, ' – ').replace(/\s+/g, ' ').trim();
    }
  }
  
  return { channelId, channelName, channelUrl };
}

/**
 * Watch for dynamic changes in YouTube page (for SPA navigation)
 */
export function watchForYouTubeChanges(callback: (pageInfo: YouTubePageInfo) => void) {
  let currentUrl = window.location.href;
  let currentPageInfo = detectYouTubePage();
  
  // Initial callback
  callback(currentPageInfo);
  
  // Watch for URL changes (YouTube SPA navigation)
  const observer = new MutationObserver(() => {
    const newUrl = window.location.href;
    if (newUrl !== currentUrl) {
      currentUrl = newUrl;
      
      // Wait a bit for DOM to update after navigation
      setTimeout(() => {
        const newPageInfo = detectYouTubePage();
        if (JSON.stringify(newPageInfo) !== JSON.stringify(currentPageInfo)) {
          currentPageInfo = newPageInfo;
          callback(newPageInfo);
        }
      }, 500);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Also listen for popstate events
  window.addEventListener('popstate', () => {
    setTimeout(() => {
      const newPageInfo = detectYouTubePage();
      if (JSON.stringify(newPageInfo) !== JSON.stringify(currentPageInfo)) {
        currentPageInfo = newPageInfo;
        callback(newPageInfo);
      }
    }, 500);
  });
  
  return observer;
}

/**
 * Get channel ID from various YouTube URL formats
 */
export function extractChannelIdFromUrl(url: string): string | null {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  
  // Handle /channel/UCxxxxx format
  if (pathname.includes('/channel/')) {
    const match = pathname.match(/\/channel\/([^\/]+)/);
    return match ? match[1] : null;
  }
  
  // Handle /@username format - we can't directly convert this to channel ID
  // without additional API calls
  if (pathname.startsWith('/@')) {
    return null; // Would need YouTube API to resolve
  }
  
  // Handle /c/customname format - also needs API resolution
  if (pathname.startsWith('/c/')) {
    return null;
  }
  
  return null;
} 