document.getElementById("saveApiKey").addEventListener("click", () => {
    const apiKey = document.getElementById("apiKeyInput").value.trim();

    if (!apiKey) {
        document.getElementById("status").innerText = "API Key cannot be empty.";
        return;
    }

    chrome.storage.local.set({ openai_api_key: apiKey }, () => {
        document.getElementById("status").innerText = "API Key saved successfully!";
    });
});

// Load the stored API key when the settings page is opened
chrome.storage.local.get(["openai_api_key"], (result) => {
    if (result.openai_api_key) {
        document.getElementById("apiKeyInput").value = result.openai_api_key;
    }
});
