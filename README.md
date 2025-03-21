# Unix Timestamp Converter

A Chrome extension that converts between Unix timestamps and human-readable dates.

## Features

- Convert Unix timestamps to human-readable dates
- Convert dates to Unix timestamps
- Real-time conversion as you type
- Shows GMT time, local time, and relative time
- Prefills with current date and time
- One-click copy to clipboard
- Clean, minimal design

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/ddobrinskiy/unix-converter-extension.git
   cd unix-converter-extension
   ```

2. Install dependencies:
   ```bash
   make install
   ```

3. Build the extension:
   ```bash
   make build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked"
   - Select the `dist` directory from this project

## Development

- Run in watch mode:
  ```bash
  make watch
  ```

- Clean build artifacts:
  ```bash
  make clean
  ```

- Create distribution zip file:
  ```bash
  make zip
  ```

## License

ISC License 