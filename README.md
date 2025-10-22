# Rufuz the quick note guy

A Firefox extension that reads web pages and gets an AI to write notes for you with one keyboard shortcut. Read first, press the key, get organized notes.

![Icon](icon-96.png)

## Features

- **One hotkey and you're done**: Press `Alt+Shift+N` and let the robot do the work
- **Groq API with Llama 3.3 70B**: Pretty fast, pretty smart, pretty free
- **25+ languages**: English, Spanish, French, German, Nordic stuff, and more
- **Creates folders in Downloads**: Tell it a folder name and it'll create it if it doesn't exist
- **Markdown output**: Clean formatting with metadata and all that
- **Quick notification**: Get a little popup when your notes are saved, then it's done

## Installation

### Temporary (you'll need to reload it every time Firefox restarts)

1. Download or clone this repo
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Pick the `manifest.json` file
5. Set up your API key (see Configuration)

### Permanent (requires signing or Firefox Developer Edition)

Check the notes below if you want it to persist. Temporary gets annoying fast.

### Requirements

- Firefox 109.0 or later
- Free Groq API key from [console.groq.com](https://console.groq.com)

## Configuration

1. Go to `about:addons`
2. Find "Rufuz the quick note guy" and click the gear icon
3. Click "Preferences"
4. Set up:
   - **Groq API Key**: Get one free at Groq
   - **Output Language**: Pick from 25+ languages
   - **Save Folder**: Whatever folder name you want in Downloads (like "AI-Notes")

## Usage

1. Read a webpage
2. Press `Alt+Shift+N`
3. Wait a couple seconds
4. Done. Notes saved to `Downloads/[your-folder]/notes-[page-title]-[timestamp].md`

### Change the keyboard shortcut if you want

1. Go to `about:addons`
2. Click the gear icon
3. "Manage Extension Shortcuts"
4. Pick whatever key combo you want

## How It Works

1. **Grabs the text** from whatever page you're on
2. **Sends it to Groq** (Llama 3.3 70B model)
3. **AI writes notes** with:
   - Quick summary
   - Key points
   - Important stuff
   - Action items
4. **Saves as markdown** in your folder

## Tech Stack

- **Manifest V2** - Firefox compatible
- **Groq API** - Llama 3.3 70B
- **Native Firefox APIs** - downloads, storage, notifications
- **Vanilla JavaScript** - no frameworks, no bloat

## File Structure

```
AI-Mozilla-Extension/
├── manifest.json       # Extension configuration
├── background.js       # Background script handling AI and downloads
├── content.js          # Content script for page text extraction
├── options.html        # Settings page UI
├── options.js          # Settings page logic
├── icon-48.png         # Extension icon (48x48)
├── icon-96.png         # Extension icon (96x96)
└── icon.svg            # Source SVG icon
```

## Privacy

- API key stored locally in Firefox
- Page content only goes to Groq for processing
- Nothing sent to third parties
- All notes saved on your machine

## Performance

- **Grabbing text**: ~10-50ms
- **AI thinking**: 2-5 seconds
- **Total**: Usually 2-6 seconds start to finish

## API Costs

Groq's free tier is pretty solid:
- 30 requests per minute
- Free for normal people
- Llama 3.3 70B is fast

## Troubleshooting

**Notes not saving:**
- Did you save your settings after entering the folder name?
- Try reloading the extension in `about:debugging`

**API key error:**
- Double-check your Groq API key
- Make sure you have credits at [console.groq.com](https://console.groq.com)

**Keyboard shortcut not working:**
- Probably conflicts with another extension or browser shortcut
- Change it in Manage Extension Shortcuts

## Making It Permanent

The temporary loading thing gets old. Here's how to fix it:

### Option 1: Sign it with Mozilla (works on regular Firefox)
1. Get `web-ext` tool (via npm, system package manager, or Docker)
2. Get API credentials from https://addons.mozilla.org/developers/addon/api/key/
3. Run: `web-ext sign --api-key=YOUR_KEY --api-secret=YOUR_SECRET`
4. Install the signed `.xpi` file

### Option 2: Firefox Developer Edition (easiest)
1. Install Firefox Developer Edition
2. Go to `about:config`, set `xpinstall.signatures.required` to `false`
3. Create XPI: `zip -r -FS ../ai-page-notes.xpi * --exclude '*.git*'`
4. Install via `about:addons` → Install Add-on From File

## Contributing

Found a bug or want to improve something? Open an issue or PR!

## License

MIT

## Credits

Built with ☕ Claude my guy

Icon inspired by Rufus from Kim Possible
