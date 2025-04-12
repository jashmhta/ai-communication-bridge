chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "callAI") {
    const apiProvider = request.apiProvider;
    const apiKey = request.apiKey;
    const message = request.message;
    
    if (apiProvider === "openai") {
      // Call OpenAI API
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: message }]
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          sendResponse({ success: false, error: data.error.message });
        } else {
          sendResponse({ success: true, aiResponse: data.choices[0].message.content });
        }
      })
      .catch(error => {
        sendResponse({ success: false, error: error.toString() });
      });
      
    } else if (apiProvider === "anthropic") {
      // Call Anthropic API
      fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: "claude-3-opus-20240229",
          max_tokens: 1000,
          messages: [{ role: "user", content: message }]
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          sendResponse({ success: false, error: data.error.message });
        } else {
          sendResponse({ success: true, aiResponse: data.content[0].text });
        }
      })
      .catch(error => {
        sendResponse({ success: false, error: error.toString() });
      });
    } else if (apiProvider === "gemini") {
      // Call Google Gemini API
      fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          sendResponse({ success: false, error: data.error.message });
        } else {
          sendResponse({ 
            success: true, 
            aiResponse: data.candidates[0].content.parts[0].text 
          });
        }
      })
      .catch(error => {
        sendResponse({ success: false, error: error.toString() });
      });
    }
    
    return true; // Required for async sendResponse
  }
});
