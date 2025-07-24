import { ExtensionMessage, MessageType, MessagePayload } from '@/types';

/**
 * Send message to background script
 */
export async function sendToBackground<T extends MessageType>(
  type: T,
  payload?: MessagePayload[T]
): Promise<any> {
  return new Promise((resolve, reject) => {
    const message: ExtensionMessage = { type, payload };
    
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
}

/**
 * Send message to content script
 */
export async function sendToContent<T extends MessageType>(
  tabId: number,
  type: T,
  payload?: MessagePayload[T]
): Promise<any> {
  return new Promise((resolve, reject) => {
    const message: ExtensionMessage = { type, payload };
    
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
}

/**
 * Set up message listener
 */
export function setupMessageListener(
  handler: (message: ExtensionMessage, sender: chrome.runtime.MessageSender) => Promise<any>
) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handler(message, sender)
      .then(sendResponse)
      .catch((error) => {
        console.error('[EnshitRadar] Message handler error:', error);
        sendResponse({ error: error.message });
      });
    
    // Return true to indicate we'll send a response asynchronously
    return true;
  });
}

/**
 * Get current active tab
 */
export async function getCurrentTab(): Promise<chrome.tabs.Tab> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

/**
 * Debounce function for limiting rapid function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 