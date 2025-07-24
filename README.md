# 🔍 EnshitRadar - Chrome Extension Template

A modern, comprehensive TypeScript Chrome extension template with best practices, featuring Manifest V3, Zustand state management, and a complete development workflow.

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

## 🔧 Development

### Available Commands

You can use either **npm/pnpm scripts** or **Make commands**:

#### NPM/PNPM Scripts

| Script                | Description                               |
| --------------------- | ----------------------------------------- |
| `pnpm install`        | Install dependencies                      |
| `pnpm run dev`        | Start development mode with file watching |
| `pnpm run build`      | Build for production                      |
| `pnpm run debug`      | Build and show loading instructions       |
| `pnpm run lint`       | Run ESLint                                |
| `pnpm run lint:fix`   | Fix ESLint errors automatically           |
| `pnpm run format`     | Format code with Prettier                 |
| `pnpm run type-check` | Run TypeScript type checking              |
| `pnpm run check`      | Run all checks (type, lint, format)       |
| `pnpm run fix`        | Fix all linting and formatting issues     |
| `pnpm run package`    | Build and create zip file                 |
| `pnpm run setup`      | Install dependencies and build            |

#### Make Commands (wrappers around npm scripts)

| Command           | Description                               |
| ----------------- | ----------------------------------------- |
| `make install`    | Install dependencies                      |
| `make dev`        | Start development mode with file watching |
| `make build`      | Build for production                      |
| `make debug`      | Build and open Chrome extensions page     |
| `make lint`       | Run ESLint                                |
| `make lint-fix`   | Fix ESLint errors automatically           |
| `make format`     | Format code with Prettier                 |
| `make type-check` | Run TypeScript type checking              |
| `make check`      | Run all checks (type, lint, format)       |
| `make fix`        | Fix all linting and formatting issues     |
| `make zip`        | Build and create distribution zip file    |
| `make setup`      | Install dependencies and build            |
| `make clean`      | Clean build directory                     |

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

## 📚 Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/migrating/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

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
