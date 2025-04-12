document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  chrome.storage.sync.get(['apiProvider', 'apiKey', 'triggerCommand'], function(items) {
    if (items.apiProvider) document.getElementById('apiProvider').value = items.apiProvider;
    if (items.apiKey) document.getElementById('apiKey').value = items.apiKey;
    if (items.triggerCommand) document.getElementById('triggerCommand').value = items.triggerCommand;
  });
  
  // Save settings
  document.getElementById('saveButton').addEventListener('click', function() {
    const apiProvider = document.getElementById('apiProvider').value;
    const apiKey = document.getElementById('apiKey').value;
    const triggerCommand = document.getElementById('triggerCommand').value;
    
    chrome.storage.sync.set({
      apiProvider: apiProvider,
      apiKey: apiKey,
      triggerCommand: triggerCommand
    }, function() {
      const status = document.getElementById('status');
      status.textContent = 'Settings saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 2000);
    });
  });
});
