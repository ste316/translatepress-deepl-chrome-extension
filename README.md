# TranslatePress Automation Extension

A Chrome browser extension designed to automate the translation workflow in WordPress sites using TranslatePress. This extension streamlines the process of translating content from English to Italian by integrating with DeepL's translation API.

## Features

- **Automated Translation**: Integrates with DeepL API for high-quality translations
- **User-Friendly Controls**: Three main buttons for different operations
  - "Translate & Save" - handles the complete translation workflow
  - "Next" - moves to next text without translating
  - "Reset" - returns to the beginning of the translation process
- **Error Handling**: Robust error checking and retry mechanisms
- **Visual Feedback**: Clear button states indicating current operation status
- **Performance Optimized**: Batched DOM operations for smooth functionality

## Technical Overview

### Components
- `manifest.json`: Extension configuration
- `content.js`: Main functionality and UI controls
- Backend service: DeepL API integration

### Workflow

1. **Initialization**
   - Extension loads on page
   - Adds control buttons to top-left corner
   - Buttons start disabled until page is ready

2. **Page Ready Check**
   - Verifies source/destination textareas exist
   - Checks for save and next buttons
   - Enables controls when everything is ready

3. **Translation Process**
   ```
   User clicks "Translate & Save" →
   ├── Get source English text
   ├── Send to DeepL API via backend
   ├── Receive Italian translation
   ├── Set translated text in textarea
   ├── Click textarea to trigger focus
   ├── Wait 500ms
   ├── Click save button
   ├── Check for save confirmation icon
   │   └── Retry save if not confirmed
   └── Move to next text when saved
   ```

4. **Skip Process**
   ```
   User clicks "Skip" →
   └── Move directly to next text
   ```

5. **Reset Process**
   ```
   User clicks "Reset" →
   ├── Find first/previous page button
   ├── Clear any existing translation
   └── Return to start of translation sequence
   ```

## Error Handling

- Catches and logs all errors
- Retries save operations if needed
- Provides visual feedback through button states
- Maintains consistent state even if operations fail

## Requirements

- Chrome browser
- WordPress site with TranslatePress plugin installed
- DeepL API key
- Backend service running for API integration

## Installation & Setup

### 1. Backend Setup (Python)
1. **Configure Backend**
   - Navigate to `backend/`
   - Generate SSL certificates (if not existing):
     ```bash
     # Generate SSL certificates
     openssl req -x509 -newkey rsa:4096 -nodes \
       -out cert.pem \
       -keyout key.pem \
       -days 365 \
       -subj "/C=IT/ST=State/L=City/O=Organization/CN=localhost"
     ```
   - **Obtain a DeepL API Key**
     1. Visit the [DeepL website](https://www.deepl.com/it/your-account)
     2. Create a free DeepL account
     3. Navigate to [https://www.deepl.com/it/your-account/keys](https://www.deepl.com/it/your-account/keys)
     4. Create a new API key
     5. Copy the generated API key

   - **Configure the DeepL API Key**
     - Create a `.env` file in the `backend` directory
     - Add your API key:
       ```bash
       # .env file
       DEEPL_API_KEY=your_deepl_api_key_here
       ```
     - Ensure `.env` is listed in `.gitignore`

2. **Start the Python Backend**
   ```bash
   # Install requirements (first time only)
   pip install fastapi uvicorn httpx pydantic

   # Run the server
   python main.py
   ```
   The server will run on `localhost:8443` with HTTPS. When first accessing, Chrome will show a security warning - click "Advanced" and "Proceed to localhost (unsafe)" to continue.

### 2. Chrome Extension Setup
1. Clone this repository
2. Load the extension in Chrome:
   - Open Chrome
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the extension directory

## Usage Guide

1. **Access TranslatePress**
   - Open your WordPress site with TranslatePress plugin activated
   - The control panel will appear automatically in the top-left corner

2. **Control Panel Features**
   - **Translate & Save**: Auto-translate and save current text
   - **Previous**: Go back to previous text
   - **Next**: Move to next text
   - **Reset**: Reset button state (keeps translation)
   - Panel is draggable using the dots (⋮⋮) at the top

3. **Translation Workflow**
   ```
   User clicks "Translate & Save" →
   ├── Get source English text
   ├── Send to DeepL API via backend
   ├── Receive Italian translation
   ├── Set translated text in textarea
   ├── Click textarea to trigger focus
   ├── Wait 500ms
   ├── Click save button
   ├── Check for save confirmation icon
   │   └── Retry save if not confirmed
   └── Move to next text when saved
   ```

## Troubleshooting

- If buttons are unresponsive, refresh the page
- If translations aren't working:
  1. Check if Python backend is running (`localhost:8443`)
  2. Check Chrome console for error messages
  3. Verify network connectivity
  4. Ensure DeepL API key is valid
- If navigation fails, try using Reset button
- If Python server fails to start:
  1. Check if port 8443 is free
  2. Verify SSL certificates exist
  3. Check Python version (3.6+ required)
  4. Verify all dependencies are installed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## About the Author

I'm Stefano Prato, a freelance software developer specializing in AI technologies. With a passion for creating efficient solutions, I developed this TranslatePress Automation Extension to streamline the translation workflow.

You can find me on LinkedIn and learn more about my professional work: [Stefano Prato](https://www.linkedin.com/in/stefano-prato/)

Feel free to connect, collaborate, or discuss potential projects!

## License

MIT License

Copyright (c) 2025 Stefano Prato

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.