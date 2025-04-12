// Configuration
let triggerCommand = '/ai_converse';
let apiProvider = 'openai';
let apiKey = '';

// Load settings
chrome.storage.sync.get(['apiProvider', 'apiKey', 'triggerCommand'], function(items) {
  if (items.apiProvider) apiProvider = items.apiProvider;
  if (items.apiKey) apiKey = items.apiKey;
  if (items.triggerCommand) triggerCommand = items.triggerCommand;
});

// Listen for settings changes
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.apiProvider) apiProvider = changes.apiProvider.newValue;
  if (changes.apiKey) apiKey = changes.apiKey.newValue;
  if (changes.triggerCommand) triggerCommand = changes.triggerCommand.newValue;
});

// Main functionality
function init() {
  console.log("AI Conversation Bridge initialized");
  
  // Set up message input monitoring
  setupInputMonitoring();
  
  // Set up chat container monitoring
  setupChatMonitoring();
}

function setupInputMonitoring() {
  // This function needs to be customized based on the website structure
  document.addEventListener('keydown', function(event) {
    // Check if Enter key is pressed in a text input or textarea
    if (event.key === 'Enter' && !event.shiftKey && 
        (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')) {
      
      const text = event.target.value.trim();
      
      // Check if the text starts with the trigger command
      if (text === triggerCommand) {
        event.preventDefault(); // Prevent sending the command
        event.target.value = ''; // Clear the input field
        
        // Find the last Manus message
        const manusMessage = findLastManusMessage();
        if (manusMessage) {
          console.log("Found Manus message:", manusMessage);
          sendToAI(manusMessage);
        } else {
          console.log("No Manus message found");
          insertSystemMessage("No message from Manus found to send to AI.");
        }
      }
    }
  });
}

function setupChatMonitoring() {
  // This function needs to be customized based on the website structure
  // Use MutationObserver to watch for new messages
  const chatContainer = findChatContainer();
  
  if (chatContainer) {
    console.log("Found chat container, setting up observer");
    
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // New elements were added to the chat
          console.log("Chat container updated");
        }
      }
    });
    
    observer.observe(chatContainer, { childList: true, subtree: true });
  } else {
    console.log("Chat container not found");
    // Try again after a delay
    setTimeout(setupChatMonitoring, 2000);
  }
}

function findChatContainer() {
  // This function needs to be customized based on the website structure
  // Try various common selectors for chat containers
  return document.querySelector('.chat-container') || 
         document.querySelector('.conversation-container') ||
         document.querySelector('.messages-container') ||
         document.querySelector('[role="log"]') ||
         document.querySelector('main');
}

function findLastManusMessage() {
  // This function needs to be customized based on the website structure
  // Try to find messages that might be from Manus
  const messages = document.querySelectorAll('.message, .chat-message, [role="listitem"]');
  
  // Loop through messages in reverse to find the last one from Manus
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    
    // Check if this message is from Manus (customize this logic)
    // This is a simplified example - you'll need to adjust based on the actual DOM structure
    if (!message.classList.contains('user-message') && 
        !message.querySelector('.user-avatar')) {
      
      // Extract the text content
      return message.textContent.trim();
    }
  }
  
  return null;
}

function sendToAI(message) {
  console.log(`Sending message to ${apiProvider} API:`, message);
  insertSystemMessage(`Sending message to ${apiProvider}...`);
  
  chrome.runtime.sendMessage(
    {
      action: "callAI",
      apiProvider: apiProvider,
      apiKey: apiKey,
      message: message
    },
    response => {
      if (response && response.success) {
        console.log("Received AI response:", response.aiResponse);
        insertAIResponse(response.aiResponse);
      } else {
        console.error("Error calling AI:", response ? response.error : "No response");
        insertSystemMessage(`Error: ${response ? response.error : "Failed to get response from AI"}`);
      }
    }
  );
}

function insertAIResponse(responseText) {
  // Create a new message element
  const aiResponseElement = document.createElement('div');
  aiResponseElement.className = 'ai-response-container';
  
  // Style the element to make it stand out
  aiResponseElement.style.margin = '10px 0';
  aiResponseElement.style.padding = '10px';
  aiResponseElement.style.backgroundColor = '#f0f7ff';
  aiResponseElement.style.borderRadius = '8px';
  aiResponseElement.style.border = '1px solid #c0d7ff';
  
  // Add the content
  aiResponseElement.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 5px; color: #4285f4;">External AI Response:</div>
    <div>${responseText}</div>
  `;
  
  // Insert into the chat
  const chatContainer = findChatContainer();
  if (chatContainer) {
    chatContainer.appendChild(aiResponseElement);
    aiResponseElement.scrollIntoView({ behavior: 'smooth' });
  } else {
    console.error("Could not find chat container to insert AI response");
  }
}

function insertSystemMessage(message) {
  // Create a new message element
  const systemMessageElement = document.createElement('div');
  systemMessageElement.className = 'system-message-container';
  
  // Style the element
  systemMessageElement.style.margin = '10px 0';
  systemMessageElement.style.padding = '8px';
  systemMessageElement.style.backgroundColor = '#f5f5f5';
  systemMessageElement.style.borderRadius = '8px';
  systemMessageElement.style.color = '#666';
  systemMessageElement.style.fontSize = '0.9em';
  systemMessageElement.style.textAlign = 'center';
  
  // Add the content
  systemMessageElement.textContent = message;
  
  // Insert into the chat
  const chatContainer = findChatContainer();
  if (chatContainer) {
    chatContainer.appendChild(systemMessageElement);
    systemMessageElement.scrollIntoView({ behavior: 'smooth' });
  } else {
    console.error("Could not find chat container to insert system message");
  }
}

// Initialize when the page is fully loaded
window.addEventListener('load', init);
