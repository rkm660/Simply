document.addEventListener("mouseup", (event) => {
    setTimeout(() => {  
        let selection = window.getSelection();
        let selectedText = selection.toString().trim();
        let existingTooltip = document.getElementById("ai-tooltip");

        if (!selectedText) {
            if (existingTooltip) existingTooltip.remove();
            return;
        }

        if (existingTooltip) existingTooltip.remove();

        let tooltip = document.createElement("div");
        tooltip.id = "ai-tooltip";
        tooltip.style.position = "absolute";
        tooltip.style.background = "white";
        tooltip.style.border = "1px solid #ccc";
        tooltip.style.padding = "8px";
        tooltip.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.1)";
        tooltip.style.borderRadius = "5px";
        tooltip.style.display = "flex";
        tooltip.style.gap = "5px";
        tooltip.style.zIndex = "9999";

        let rect = selection.getRangeAt(0).getBoundingClientRect();
        tooltip.style.left = `${window.scrollX + rect.left}px`;
        tooltip.style.top = `${window.scrollY + rect.bottom + 5}px`;

        let button = document.createElement("button");
        button.innerText = "Simplify";
        button.style.cursor = "pointer";
        button.style.padding = "5px";
        button.style.border = "none";
        button.style.background = "#007BFF";
        button.style.color = "white";
        button.style.borderRadius = "4px";

        button.addEventListener("click", (e) => {
            e.stopPropagation();

            button.innerText = "Simplifying...";
            button.style.background = "#ff9800";
            button.style.cursor = "wait";

            let range = selection.getRangeAt(0);

            processText(selectedText, "simplify", tooltip, button, range);
        });

        tooltip.appendChild(button);
        document.body.appendChild(tooltip);
    }, 50);
});

function processText(text, type, tooltip, button, range) {
    console.log("Sending request to background.js:", { text, type });

    chrome.runtime.sendMessage({ action: "process_text", text, type }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Message error:", chrome.runtime.lastError.message);
            return;
        }
        console.log("Received response from background.js:", response);

        if (response.result && range) {
            let span = document.createElement("span");
            span.innerText = response.result;
            span.style.backgroundColor = "#fffa90"; // Highlight replaced text

            range.deleteContents();
            range.insertNode(span);

            // Synchronously update button text
            button.innerText = "Simplified!";
            button.style.background = "#28a745"; // Green for success
            button.style.cursor = "pointer";

            // Remove tooltip after a short delay
            setTimeout(() => {
                if (tooltip) tooltip.remove();
            }, 800);
        }
    });
}
