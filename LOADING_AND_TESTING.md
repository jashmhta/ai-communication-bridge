# Loading and Testing the AI Communication Bridge Extension

## Loading the Extension in Chrome

1. **Open Chrome Extensions Page**:
   - Open the Chrome browser
   - Type `chrome://extensions/` in the address bar and press Enter
   - Or navigate to Menu (three dots) > More Tools > Extensions

2. **Enable Developer Mode**:
   - Look for the "Developer mode" toggle in the top-right corner
   - Make sure it's turned ON

3. **Load the Extension**:
   - Click the "Load unpacked" button that appears after enabling Developer mode
   - Navigate to the folder containing the extension files (the cloned repository)
   - Select the folder and click "Open"
   - The extension should now appear in your extensions list

4. **Verify Installation**:
   - You should see the "AI Conversation Bridge" extension in your list of extensions
   - The extension icon should appear in your browser toolbar (top-right corner)

## Configuring the Extension

1. **Access Extension Settings**:
   - Click on the extension icon in your browser toolbar
   - This will open the popup interface with configuration options

2. **Select AI Provider**:
   - From the dropdown menu, select your preferred AI provider:
     - OpenAI
     - Anthropic Claude
     - Google Gemini

3. **Enter API Key**:
   - Enter your API key for the selected provider
   - For OpenAI: Get your API key from https://platform.openai.com/account/api-keys
   - For Anthropic: Get your API key from https://console.anthropic.com/account/keys
   - For Gemini: Get your API key from https://aistudio.google.com/app/apikey

4. **Set Trigger Command** (Optional):
   - The default trigger command is `/ai_converse`
   - You can change this to any command you prefer

5. **Save Settings**:
   - Click the "Save Settings" button
   - You should see a "Settings saved" confirmation message

## Testing the Extension

1. **Navigate to Manus Chat**:
   - Go to the website where you interact with Manus
   - Start a normal conversation

2. **Get a Response from Manus**:
   - Ask Manus a question or request information
   - Wait for Manus to respond

3. **Trigger the AI Communication**:
   - After receiving a response from Manus, type `/ai_converse` in the chat input
   - Press Enter

4. **Verify the Process**:
   - The extension should capture Manus's last response
   - You should see a system message indicating that the message is being sent to the selected AI provider
   - After a moment, you should see the external AI's response displayed in the chat

5. **Troubleshooting**:
   - If no response appears, check the browser console (F12 > Console tab) for error messages
   - Verify that your API key is correct
   - Make sure you're on a supported website (check the matches in manifest.json)
   - Try refreshing the page and testing again

## Customizing for Specific Websites

If the extension doesn't work correctly with your specific website where you interact with Manus, you may need to customize the content.js file:

1. **Identify DOM Elements**:
   - Use browser developer tools (F12) to inspect the page structure
   - Identify the selectors for the chat container and message elements

2. **Update the Following Functions in content.js**:
   - `findChatContainer()`: Update selectors to match your website's chat container
   - `findLastManusMessage()`: Update selectors to identify Manus's messages

3. **Reload the Extension**:
   - After making changes, go back to chrome://extensions/
   - Find the AI Communication Bridge extension
   - Click the refresh icon to reload the extension
   - Test again on your website

## Security Considerations

- Your API keys are stored in Chrome's sync storage
- Be cautious when using the extension on public or shared computers
- Consider using API keys with usage limits to prevent unexpected charges
- Review the privacy policies of the AI providers you're using
