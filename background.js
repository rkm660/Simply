chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "process_text" && request.type === "simplify") {
        console.log("Sending request to API:", request.text, "Type:", request.type);

        fetch("http://127.0.0.1:5003/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: request.text, type: "simplify" }) // Removed identifier
        })
        .then(response => response.json())
        .then(data => {
            console.log("API Response received:", data);
            sendResponse({ result: data.result });
        })
        .catch(error => {
            console.error("API request failed:", error);
            sendResponse({ error: error.toString() });
        });

        return true; // Keep sendResponse alive for async response
    }
});
