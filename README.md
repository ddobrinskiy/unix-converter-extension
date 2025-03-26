# Unix Timestamp Converter

A Chrome extension for converting between Unix timestamps and human-readable dates.

## Features

- Convert Unix timestamps to dates and vice versa
- Display time in both UTC and your local timezone
- Show relative time (e.g., "2 months ago")
- Calendar interface for easy date selection
- Auto-copy converted timestamps to clipboard
- Keyboard shortcut: Shift+Ctrl+U (Windows/Linux) or Shift+Command+U (Mac)

## Installation

### From Chrome Web Store

1. Visit the [Chrome Web Store page](https://chrome.google.com/webstore/detail/unix-timestamp-converter/your-extension-id)
2. Click "Add to Chrome"

### Manual Installation

1. Download or clone this repository
2. Navigate to `chrome://extensions/` in Chrome
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the `dist` folder from this repository

## Development

### Prerequisites

- Node.js and npm

### Setup

```bash
npm install
```

### Build

```bash
make build
```

## Roadmap & ToDo

- [ ] add support for millisecond and nanosecond format
    - [ ] add a picker to choose between them, and use local storage to cache the last user choice
- [ ] when pasting a timestamp, automatically identify if it's second/millisecond/nanosecond using commons sense heuristics (unlikely to have a date in the far future or past)

## License

[MIT](LICENSE) 

## Attribution

<a href="https://www.flaticon.com/free-icons/clock" title="clock icons">Clock icons created by Pongsakorn Sarunsatta - Flaticon</a>