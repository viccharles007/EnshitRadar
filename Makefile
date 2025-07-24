.PHONY: install build dev clean lint lint-fix format type-check zip debug setup check fix help

# Default target
help:
	@echo "Available commands:"
	@echo "  install    - Install dependencies using pnpm"
	@echo "  build      - Build the extension for production"
	@echo "  dev        - Start development mode with file watching"
	@echo "  clean      - Clean the dist directory"
	@echo "  lint       - Run ESLint on source files"
	@echo "  lint-fix   - Run ESLint with auto-fix"
	@echo "  format     - Format code with Prettier"
	@echo "  type-check - Run TypeScript type checking"
	@echo "  check      - Run all checks (type, lint, format)"
	@echo "  fix        - Fix linting and formatting issues"
	@echo "  zip        - Create distribution zip file"
	@echo "  debug      - Build and open Chrome extensions page"
	@echo "  setup      - Install dependencies and build"

# Install dependencies
install:
	pnpm install

# Build for production
build:
	pnpm run build

# Development mode with file watching
dev:
	pnpm run dev

# Clean build directory
clean:
	pnpm run clean

# Lint source files
lint:
	pnpm run lint

# Lint with auto-fix
lint-fix:
	pnpm run lint:fix

# Format code
format:
	pnpm run format

# Type check
type-check:
	pnpm run type-check

# Run all checks
check:
	pnpm run check

# Fix all issues
fix:
	pnpm run fix

# Create zip for distribution
zip:
	pnpm run package

# Debug mode - build and open Chrome extensions page
debug:
	pnpm run debug
	@open -a "Google Chrome" "chrome://extensions/" 2>/dev/null || echo "Please manually open chrome://extensions/"

# Quick development setup
setup:
	pnpm run setup
	@echo "Setup complete! Run 'make debug' to load the extension in Chrome" 