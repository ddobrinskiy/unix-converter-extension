.PHONY: build clean install dev watch zip

# Default target
all: build

# Install dependencies
install:
	npm install

# Build the extension
build:
	npm run build

# Clean build artifacts
clean:
	rm -rf dist

# Run development mode
dev:
	npm run watch

# Watch for changes
watch:
	npm run watch

# Package extension for distribution
zip: build
	cd dist && zip -r ../unix-timestamp-converter.zip *

# open in browser
open:
	open dist/popup/index.html
	

# Help command
help:
	@echo "Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make build    - Build the extension"
	@echo "  make clean    - Remove build artifacts"
	@echo "  make dev      - Run in development mode"
	@echo "  make watch    - Watch for changes"
	@echo "  make zip      - Create a zip file for distribution"
