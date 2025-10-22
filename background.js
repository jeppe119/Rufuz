// Listen for keyboard command
browser.commands.onCommand.addListener((command) => {
  if (command === "capture-notes") {
    capturePageNotes();
  }
});

async function capturePageNotes() {
  try {
    // Get the active tab
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];

    if (!activeTab || !activeTab.id) {
      console.error("No active tab found");
      return;
    }

    // Inject content script to extract page content
    await browser.tabs.executeScript(activeTab.id, {
      file: "content.js"
    });
  } catch (error) {
    console.error("Error capturing page notes:", error);
    browser.notifications.create({
      type: "basic",
      title: "AI Page Notes",
      message: `Error: ${error.message}`
    });
  }
}

// Listen for messages from content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PAGE_CONTENT") {
    processPageContent(message.data, sender.tab);
  }
});

async function processPageContent(pageData, tab) {
  try {
    // Get settings from storage
    const storage = await browser.storage.local.get(["groqApiKey", "outputLanguage", "savePath"]);
    const apiKey = storage.groqApiKey;
    const language = storage.outputLanguage || "English";
    const savePath = storage.savePath || "";

    if (!apiKey) {
      browser.notifications.create({
        type: "basic",
        title: "AI Page Notes",
        message: "Please configure your API key in extension settings"
      });
      // Open settings page
      browser.runtime.openOptionsPage();
      return;
    }

    // Show processing notification
    browser.notifications.create({
      type: "basic",
      title: "AI Page Notes",
      message: "Processing page with AI..."
    });

    // Generate notes with Groq
    const notes = await generateNotesWithGroq(pageData, apiKey, language);

    // Save the notes
    await saveNotes(notes, pageData.title, savePath);

    // Show success notification
    browser.notifications.create({
      type: "basic",
      title: "AI Page Notes",
      message: "Notes saved successfully!"
    });
  } catch (error) {
    console.error("Error processing page content:", error);
    browser.notifications.create({
      type: "basic",
      title: "AI Page Notes",
      message: `Error: ${error.message}`
    });
  }
}

async function generateNotesWithGroq(pageData, apiKey, language) {
  const prompt = `Please analyze this web page and create structured notes in markdown format.

Page Title: ${pageData.title}
URL: ${pageData.url}

Page Content:
${pageData.content}

Create comprehensive notes that include:
1. A brief summary (2-3 sentences)
2. Key points and main ideas
3. Important details or data
4. Any actionable items or takeaways

IMPORTANT: Write the entire response in ${language}.
Format the output as clean markdown.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const aiNotes = data.choices[0].message.content;

    // Add metadata header
    const notesWithMetadata = `# Notes for: ${pageData.title}
URL: ${pageData.url}
Captured: ${new Date().toISOString()}

---

${aiNotes}`;

    return notesWithMetadata;
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Cannot connect to Groq API. Check your internet connection.");
    }
    throw error;
  }
}

async function saveNotes(content, pageTitle, savePath) {
  // Create filename from page title and timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeTitle = pageTitle.replace(/[^a-z0-9]/gi, "-").substring(0, 50);
  const baseFilename = `notes-${safeTitle}-${timestamp}.md`;

  // Construct full path
  let fullPath;
  if (savePath && savePath.trim() !== "") {
    const cleanPath = savePath.trim().replace(/^\/+/, '').replace(/\/$/, '');
    fullPath = `${cleanPath}/${baseFilename}`;
  } else {
    fullPath = baseFilename;
  }

  // Create a blob and download it
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  await browser.downloads.download({
    url: url,
    filename: fullPath,
    saveAs: false,
    conflictAction: "uniquify"
  });
}
