// Load saved settings when page opens
document.addEventListener('DOMContentLoaded', async () => {
  const settings = await browser.storage.local.get(['groqApiKey', 'outputLanguage', 'savePath']);

  if (settings.groqApiKey) {
    document.getElementById('apiKey').value = settings.groqApiKey;
  }

  if (settings.outputLanguage) {
    document.getElementById('language').value = settings.outputLanguage;
  } else {
    document.getElementById('language').value = 'English';
  }

  if (settings.savePath) {
    document.getElementById('savePath').value = settings.savePath;
  }
});

// Save settings when form is submitted
document.getElementById('settings-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const apiKey = document.getElementById('apiKey').value.trim();
  const language = document.getElementById('language').value;
  const savePath = document.getElementById('savePath').value.trim();
  const statusDiv = document.getElementById('status');

  // Validate API key
  if (!apiKey) {
    statusDiv.className = 'status error';
    statusDiv.textContent = 'Please enter your Groq API key';
    return;
  }

  try {
    // Save to storage
    await browser.storage.local.set({
      groqApiKey: apiKey,
      outputLanguage: language,
      savePath: savePath
    });

    // Show success message
    statusDiv.className = 'status success';
    statusDiv.textContent = 'Settings saved successfully!';

    // Hide success message after 3 seconds
    setTimeout(() => {
      statusDiv.className = 'status';
      statusDiv.textContent = '';
    }, 3000);

  } catch (error) {
    statusDiv.className = 'status error';
    statusDiv.textContent = `Error saving settings: ${error.message}`;
  }
});
