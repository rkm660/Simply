chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "process_text" && request.type === "simplify") {
        console.log("Sending request to API:", request.text, "Type:", request.type, "Identifier:", request.identifier);

        fetch("http://127.0.0.1:5002/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: request.text, type: "simplify", identifier: request.identifier })
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

        return true;
    }
});
