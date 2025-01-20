# TranslatePress Automation Extension - Complete Setup Guide

## 1. Backend Setup (Python)
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
     - Add your API key to the file:
       ```bash
       # .env file
       DEEPL_API_KEY=your_deepl_api_key_here
       ```
     - Ensure `.env` is listed in `.gitignore` to protect your key
     - The backend will automatically load the key using `python-dotenv`

2. **Start the Python Backend**
   ```bash
   # Install requirements (first time only)
   pip install fastapi uvicorn httpx pydantic

   # Run the server
   python main.py
   ```
   - Server will run on `localhost:8443` with HTTPS
   - When you open `https://localhost:8443`, Chrome will show a security warning
   - Click on "Advanced" and then "Proceed to localhost (unsafe)" to continue

## 2. Chrome Extension Setup
1. **Load the Extension in Chrome**
   - Open Chrome browser
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top-right toggle)
   - Click "Load unpacked"
   - Select the `chrome-extension` directory containing `manifest.json`

## 3. Using the Extension

1. **Access TranslatePress**
   - Open your WordPress site
   - Go to your WordPress site with TranslatePress plugin activated
   - The control panel will appear automatically in the top-left corner

2. **Control Panel Buttons**
   - The floating panel has 4 buttons:
     - **Translate & Save**: Auto-translate and save
     - **Previous**: Go back to previous text
     - **Next**: Move to next text
     - **Reset**: Reset button state (keeps translation)

3. **Translation Workflow**
   - For each text block:
     - Review the English text
     - Click "Translate & Save" for automatic translation
     - Or click "Next" to skip this text
     - Use "Previous" to go back
     - Use "Reset" if needed (translation will be preserved)

4. **Panel Features**
   - Draggable: Use the dots (⋮⋮) at the top to move the panel
   - Always visible: Stays on top of other elements
   - Responsive: Shows button states clearly

## Tips
- Both Python backend and Chrome extension must run simultaneously
- The panel can be moved anywhere on the screen
- Buttons will be disabled during active operations
- Failed translations will auto-skip to next text
- Reset preserves existing translations

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