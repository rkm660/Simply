chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "process_text" && request.type === "simplify") {
        console.log("Sending request to OpenAI:", request.text);

        // Retrieve API key from Chrome storage
        chrome.storage.local.get(["openai_api_key"], (result) => {
            const apiKey = result.openai_api_key;
            if (!apiKey) {
                console.error("No OpenAI API key found. Please set it in the extension settings.");
                sendResponse({ error: "Missing OpenAI API Key" });
                return;
            }

            fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "system", content: "You are an AI that simplifies complex text." },
                               { role: "user", content: `Simplify this text: "${request.text}"` }],
                    max_tokens: 100,
                    temperature: 0.7
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.choices && data.choices.length > 0) {
                    sendResponse({ result: data.choices[0].message.content.trim() });
                } else {
                    sendResponse({ error: "Invalid response from OpenAI" });
                }
            })
            .catch(error => {
                console.error("OpenAI API request failed:", error);
                sendResponse({ error: error.toString() });
            });

            return true; // Keep sendResponse alive for async response
        });

        return true; // Keep sendResponse alive
    }
});
