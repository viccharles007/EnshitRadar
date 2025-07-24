# 🔍 EnshitRadar - YouTube Channel Quality Monitor

A Chrome extension that detects YouTube channels compromised by private equity or experiencing significant quality decline. Get warned before watching content from channels that may no longer represent their original values.

## 🔗 Quick Links

- **🏪 [Chrome Web Store](https://chrome.google.com/webstore/detail/enshitradar/)** - Install the extension
- **💬 [Discord Community](https://discord.gg/brCNpJcx)** - Join to discuss and propose new ideas
- **📺 [YouTube Channel](https://www.youtube.com/@justmadlime)** - Updates & tutorials
- **🚀 [Submit Channel](https://github.com/justmadlime/EnshitRadar/tree/main)** - Add new channels via PR

## 📖 User Guide

### **Installation & Setup**

> ⚠️ **Note**: The extension in the Chrome Web Store is currently under validation. If not available, use the manual installation method below.

#### **Method 1: Chrome Web Store** (Recommended when available)

1. **Install**: Visit [Chrome Web Store](https://chrome.google.com/webstore/detail/enshitrador/) → "Add to Chrome"
2. **Start**: Click the EnshitRadar icon in your toolbar (enabled by default)
3. **Use**: Visit any YouTube channel or video - warnings appear automatically

#### **Method 2: Manual Installation**

1. **Download**:
   - Go to [Releases](https://github.com/justmadlime/EnshitRadar/releases) → Download latest `.zip` file
   - Extract the zip to the folder

2. **Install in Chrome**:
   - Open Chrome → `chrome://extensions/`
   - Enable "Developer mode" (top-right toggle)
   - Click "Load unpacked"
   - Select the `dist` folder (or extracted folder from .zip)

3. **Verify**: EnshitRadar icon should appear in your toolbar

### **How It Works**

EnshitRadar monitors YouTube and:

1. **Detects** channels you're viewing (works on channel pages and videos)
2. **Checks** our community database for quality concerns
3. **Shows** warning banners for flagged channels
4. **Allows** temporary dismissal per browser session

### **Warning Levels**

| Level            | Color  | Meaning                                               |
| ---------------- | ------ | ----------------------------------------------------- |
| **🟢 Low**       | Green  | Minor quality decline, some commercialization         |
| **🟡 Medium**    | Yellow | Significant commercialization, more sponsored content |
| **🟠 High**      | Orange | Heavily compromised, misleading content likely        |
| **🔴 Confirmed** | Red    | Sold to private equity, original creators gone        |

### **Managing Warnings**

- **Close**: Remove warning for current page
- **Dismiss for Session**: Hide warnings for this channel until browser restart
- **Learn More**: View detailed information about the channel

### **Settings**

Access via extension icon → "Options" or `chrome://extensions/` → EnshitRadar → "Options"

- **Enable/Disable** extension
- **View Statistics** of monitored channels
- **Export/Clear Data** for privacy
- **Manual Cleanup** of session storage

## 🤝 Contributing Channels

Help expand our database! We welcome community contributions of flagged channels.

### **Quick Report** (Recommended)

Create an [issue](https://github.com/your-username/enshitradar/issues) with:

- **Channel Name**: [Exact YouTube name]
- **Channel URL**: [YouTube URL]
- **Suggested Level**: [low/medium/high/confirmed]
- **Evidence**: [Links, description of what happened]

### **Pull Request Submission**

For direct contributions:

1. **Fork** this repository
2. **Edit** `src/data/channels.json`, add:
   ```json
   {
     "channelId": "UC_CHANNEL_ID_HERE",
     "channelName": "Exact Channel Name",
     "level": "confirmed",
     "description": "Why flagged (optional)",
     "dateAdded": "2025-01-19",
     "source": "Community report"
   }
   ```
3. **Test** your changes work
4. **Submit PR** with evidence and verification

**Finding Channel ID**: Visit channel → URL shows `youtube.com/channel/UC...` (the `UC...` part is the ID)

## 🧹 Privacy & Data

### **Automatic Cleanup**

- **Extension disabled/uninstalled**: All data cleared
- **Browser closed**: Session data cleared automatically

### **Data Storage**

- **Settings**: `chrome.storage.sync` (syncs across devices)
- **Statistics**: `chrome.storage.local` (local only)
- **Dismissed warnings**: `sessionStorage` (temporary, per-tab)

### **Manual Cleanup**

Options page → "Cleanup Session Data" button clears dismissed warnings

---

**Built with ❤️ by the community. Help us keep YouTube trustworthy!**
