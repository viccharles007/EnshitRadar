# 🔍 EnshitRadar - YouTube Channel Quality Monitor

A Chrome extension that detects YouTube channels that have been compromised by private equity or experienced significant quality decline. Get warned before watching content from channels that may no longer represent their original values.

## 🔗 Links

- **🏪 [Chrome Web Store](https://chrome.google.com/webstore/detail/enshitradar/)** - Install the extension
- **💬 [Discord Community](https://discord.gg/enshitradar)** - Join our community discussions
- **📺 [YouTube Channel](https://youtube.com/@enshitradar)** - Updates and tutorials

## ✨ Features

- **📦 Manifest V3** - Latest Chrome extension API
- **🏗️ TypeScript** - Full type safety with strict configuration
- **⚡ Webpack** - Modern build system with hot reload
- **🎨 Modern UI** - Beautiful popup and options pages
- **💾 Zustand Store** - Lightweight state management
- **🔧 Development Tools** - ESLint, Prettier, and comprehensive tooling
- **📱 Responsive Design** - Works across different screen sizes
- **🚀 Easy Deployment** - Simple build and packaging workflow

## 🛠️ Tech Stack

- **TypeScript** - Language
- **Webpack** - Build tool
- **Zustand** - State management
- **Chrome APIs** - Extension functionality
- **ESLint + Prettier** - Code quality
- **PNPM** - Package management

## 📁 Project Structure

```
src/
├── background/         # Service worker
│   └── index.ts
├── content/           # Content scripts
│   └── index.ts
├── popup/             # Extension popup
│   ├── index.ts
│   └── popup.html
├── options/           # Options page
│   ├── index.ts
│   └── options.html
├── stores/            # Zustand stores
│   └── settingsStore.ts
├── utils/             # Utility functions
│   └── messaging.ts
├── types/             # TypeScript definitions
│   └── index.ts
├── assets/            # Icons and images
└── manifest.json      # Extension manifest
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PNPM (recommended) or npm
- Google Chrome

### Installation

1. **Clone and setup:**

   ```bash
   git clone <your-repo>
   cd EnshitRadar

   # Using Make (recommended for simplicity)
   make setup

   # Or using pnpm directly
   pnpm run setup
   ```

2. **Load in Chrome:**

   ```bash
   # Using Make (auto-opens Chrome)
   make debug

   # Or using pnpm
   pnpm run debug
   ```

   Or manually:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

### Development Workflow

1. **Start development mode:**

   ```bash
   # Using Make
   make dev

   # Or using pnpm
   pnpm run dev
   ```

2. **Make your changes** - Files will be automatically rebuilt

3. **Reload extension** in Chrome (click the refresh icon on the extension card)

4. **Test your changes** in the browser

#### Useful Development Commands

```bash
# Run all checks before committing
make check          # or: pnpm run check

# Fix all linting and formatting issues
make fix            # or: pnpm run fix

# Build for production and package
make zip            # or: pnpm run package
```

## ⚙️ Configuration

### TypeScript Configuration

The `tsconfig.json` is configured with:

- Strict type checking
- Absolute imports via `@/` prefix
- Path mapping for organized imports
- ES2020 target for modern Chrome

### Webpack Configuration

Features include:

- TypeScript compilation
- Hot reload in development
- CSS processing
- Asset copying
- Source maps for debugging

### ESLint & Prettier

Configured for:

- TypeScript support
- Chrome extension globals
- Consistent code formatting
- Import organization

## 📦 Extension Architecture

### Background Service Worker (`src/background/`)

- Handles extension lifecycle
- Manages cross-tab communication
- Stores global state
- Handles Chrome API calls

### Content Scripts (`src/content/`)

- Runs on web pages
- Modifies page content
- Communicates with background script
- Provides main extension functionality

### Popup (`src/popup/`)

- Extension toolbar popup
- Quick settings and controls
- Real-time status display
- Settings management

### Options Page (`src/options/`)

- Comprehensive settings interface
- Statistics and analytics
- Import/export functionality
- Advanced configuration

### State Management (`src/stores/`)

Uses Zustand for:

- Settings persistence
- Cross-component state sharing
- Async state updates
- Reactive UI updates

## 🔐 Permissions

The extension requests these permissions:

- `storage` - For saving settings
- `activeTab` - For accessing current tab
- `<all_urls>` - For content script injection (adjust as needed)

## 🧹 Data Management & Privacy

### Automatic Cleanup

The extension automatically cleans up all stored data when:

- **Extension is disabled** - All `chrome.storage` and `sessionStorage` data is cleared
- **Extension is uninstalled** - Chrome automatically removes all extension data
- **Browser is closed** - Session storage is automatically cleared

### Manual Cleanup

You can manually clean session data by:

1. **Options Page**: Go to `chrome://extensions/` → EnshitRadar → Options → "Cleanup Session Data"
2. **Code**: The extension provides cleanup utilities for developers

### Data Storage

The extension stores:

- **Settings** in `chrome.storage.sync` (syncs across devices)
- **Statistics** in `chrome.storage.local` (local only)
- **Dismissed warnings** in `sessionStorage` (temporary, per-tab)

## 🎨 Customization

### Adding New Features

1. **Create types** in `src/types/`
2. **Add message handlers** in background and content scripts
3. **Update UI** in popup/options pages
4. **Add store methods** if needed

### Styling

- CSS is embedded in HTML files for simplicity
- Use CSS custom properties for theming
- Follow the existing color scheme and spacing

### Icons

Add your extension icons to `src/assets/`:

- `icon16.png` (16x16)
- `icon32.png` (32x32)
- `icon48.png` (48x48)
- `icon128.png` (128x128)

## 📊 Debugging

### Development Tools

1. **Background Script**: Chrome DevTools → Extensions → Service Worker
2. **Content Script**: Regular page DevTools
3. **Popup**: Right-click popup → Inspect
4. **Options**: Right-click options → Inspect

### Logging

- Development builds include source maps
- Use `console.log()` with descriptive prefixes
- Check the Console tab in DevTools

## 🚢 Deployment

### Building for Production

```bash
# Using Make
make zip

# Or using pnpm
pnpm run package
```

This creates `extension.zip` ready for Chrome Web Store submission.

### Chrome Web Store

1. **Prepare assets** (icons, screenshots, descriptions)
2. **Build and zip** the extension
3. **Upload to Chrome Web Store Developer Dashboard**
4. **Submit for review**

## 🔧 Advanced Configuration

### Custom Build Steps

Modify `webpack.config.js` to:

- Add new entry points
- Configure additional loaders
- Add build plugins
- Customize output structure

### Environment Variables

Add `.env` support by:

1. Installing `dotenv-webpack`
2. Configuring in `webpack.config.js`
3. Adding environment-specific builds

## ✅ TODO

### **High Priority**

- [ ] Add icon files for the extension (16x16, 32x32, 48x48, 128x128)
- [ ] Implement channel database auto-updates from remote source
- [ ] Add user reporting system for new channels
- [ ] Create comprehensive testing suite

### **Medium Priority**

- [ ] Add localization support (i18n)
- [ ] Implement custom channel whitelisting
- [ ] Add notification system for database updates
- [ ] Create analytics dashboard for detected channels

### **Low Priority**

- [ ] Add dark/light theme toggle
- [ ] Implement keyboard shortcuts
- [ ] Add export/import for custom channel lists
- [ ] Create browser notification system

### **Community Features**

- [ ] User voting system for channel ratings
- [ ] Community-driven channel submissions
- [ ] Integration with external quality tracking APIs
- [ ] Social sharing of flagged channels

## 📚 Resources

### **Extension Development**

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/migrating/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### **Community & Support**

- [🔗 Chrome Web Store](https://chrome.google.com/webstore/detail/enshitrador/)
- [💬 Discord Server](https://discord.gg/enshitradar)
- [📺 YouTube Channel](https://youtube.com/@enshitradar)
- [🐛 Report Issues](https://github.com/your-username/enshitradar/issues)
- [📧 Contact](mailto:support@enshitradar.com)

## 📖 User Guide

### **Getting Started**

1. **Install the Extension**
   - Visit the [Chrome Web Store page](https://chrome.google.com/webstore/detail/enshitrador/)
   - Click "Add to Chrome"
   - Grant the necessary permissions

2. **First Setup**
   - Click the EnshitRadar icon in your browser toolbar
   - The extension is enabled by default
   - Visit any YouTube channel or video to see it in action

### **How It Works**

When you visit YouTube, EnshitRadar automatically:

1. **Detects the channel** you're viewing (works on both channel pages and individual videos)
2. **Checks our database** for any quality concerns or ownership changes
3. **Shows a warning banner** if the channel has been flagged
4. **Lets you dismiss** warnings temporarily for your current session

### **Warning Levels**

- **🟢 Low Risk** - Minor commercialization, still mostly trustworthy
- **🟡 Medium Risk** - Noticeable quality decline, increased sponsored content
- **🟠 High Risk** - Significant concerns, heavily commercialized content
- **🔴 Confirmed** - Sold to private equity or completely compromised

### **Managing Warnings**

- **Close**: Remove the warning for this page visit
- **Dismiss for Session**: Hide warnings for this channel until you close your browser
- **Learn More**: Get detailed information about why the channel was flagged

### **Extension Settings**

Access settings by:

- Clicking the extension icon → "Options"
- Or going to `chrome://extensions/` → EnshitRadar → "Options"

Available options:

- **Enable/Disable** the extension
- **View Statistics** about detected channels
- **Export Settings** for backup
- **Clear All Data** for privacy
- **Manual Cleanup** of session data

## 🔍 **EnshitRadar Features**

### **YouTube Channel Monitoring**

The extension automatically detects when you visit YouTube and checks channels against a curated database of channels that have experienced quality decline or been compromised by private equity.

### **Warning System**

When you visit a flagged channel or watch their videos, you'll see a prominent warning banner with:

- **🟢 Low Risk** - Minor quality decline, some commercialization
- **🟡 Medium Risk** - Significant commercialization, expect more sponsored content
- **🟠 High Risk** - Heavily compromised, misleading content likely
- **🔴 Confirmed** - Sold to private equity, original creators may be gone

### **Channel Database**

The database is stored in `src/data/channels.json` and includes:

```json
{
  "channelId": "UCblfuW_4rakIf2h6aqANefA",
  "channelName": "Example Channel",
  "level": "middle",
  "description": "Custom warning message (optional)",
  "dateAdded": "2024-01-15",
  "source": "Community reports"
}
```

### **Adding New Channels**

To add channels to monitor:

1. **Get Channel Info**:
   - Visit the YouTube channel
   - Copy the channel ID from URL (e.g., `/channel/UCxxxxx`)
   - Note the exact channel name

2. **Edit Database**:
   - Open `src/data/channels.json`
   - Add new entry to the `channels` array
   - Choose appropriate risk level: `low`, `middle`, `high`, `confirmed`
   - Provide custom description (optional)

3. **Rebuild Extension**:

   ```bash
   pnpm run build
   ```

4. **Reload in Chrome**:
   - Go to `chrome://extensions/`
   - Click refresh ↻ on your extension

### **Testing the Extension**

1. **Test on Example Channel**:
   - Visit `https://www.youtube.com/@kurzgesagt` (marked as "low" risk)
   - You should see a green warning banner

2. **Test Warning Dismissal**:
   - Click "Dismiss for Session" to hide warning
   - Navigate away and back - warning won't show again this session

3. **Test Learn More**:
   - Click "Learn More" for detailed channel information

4. **Check Popup Stats**:
   - Click extension icon to see database statistics

The initial database includes **4 example channels** for testing. Update `src/data/channels.json` with real channels you want to monitor!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/yourusername/enshit-radar/issues) page
2. Review Chrome extension documentation
3. Check browser console for errors
4. Create a new issue with detailed information

---

**Happy coding! 🚀**
