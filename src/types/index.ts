// Common types for the Chrome extension

export interface ExtensionMessage {
  type: string;
  payload?: any;
}

export interface ExtensionSettings {
  enabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
}

export interface TabInfo {
  id: number;
  url: string;
  title: string;
  active: boolean;
}

export interface StorageData {
  settings: ExtensionSettings;
  lastUpdated: number;
}

// Message types for communication between scripts
export enum MessageType {
  GET_TAB_INFO = 'GET_TAB_INFO',
  UPDATE_SETTINGS = 'UPDATE_SETTINGS',
  CONTENT_LOADED = 'CONTENT_LOADED',
  TOGGLE_FEATURE = 'TOGGLE_FEATURE'
}

export interface MessagePayload {
  [MessageType.GET_TAB_INFO]: { tabId: number };
  [MessageType.UPDATE_SETTINGS]: ExtensionSettings;
  [MessageType.CONTENT_LOADED]: { url: string };
  [MessageType.TOGGLE_FEATURE]: { enabled: boolean };
} 