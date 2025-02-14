// Function to generate a rich unique identifier for an element
function getUniqueSelector(element) {
    if (!element) return null;

    let selector = element.tagName.toLowerCase(); // Start with tag name

    if (element.id) {
        return `#${element.id}`; // If the element has an ID, it's unique
    }

    if (element.className) {
        let classSelector = "." + element.className.trim().replace(/\s+/g, "."); // Convert class names to CSS selector
        selector += classSelector;
    }

    // Add nth-child position to differentiate between similar elements
    let parent = element.parentElement;
    if (parent) {
        let children = Array.from(parent.children);
        let index = children.indexOf(element) + 1; // nth-child is 1-based
        selector += `:nth-child(${index})`;
    }

    return selector;
}

// Event listener for mouse selection
document.addEventListener("mouseup", (event) => {
    setTimeout(() => {  
        let selectedText = window.getSelection().toString().trim();
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

        let rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
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

            let parentElement = window.getSelection().anchorNode.parentElement;
            let identifier = getUniqueSelector(parentElement); // Generate a unique identifier

            processText(selectedText, "simplify", tooltip, button, identifier);
        });

        tooltip.appendChild(button);
        document.body.appendChild(tooltip);
    }, 50);
});

function processText(text, type, tooltip, button, identifier) {
    console.log("Sending request to background.js:", { text, type, identifier });

    chrome.runtime.sendMessage({ action: "process_text", text, type, identifier }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Message error:", chrome.runtime.lastError.message);
            return;
        }
        console.log("Received response from background.js:", response);

        if (response.result && identifier) {
            let targetElement = document.querySelector(identifier);
            if (targetElement) {
                targetElement.innerText = response.result; // Replace text in the exact element
            }
        }

        button.innerText = "Simplify";
        button.style.background = "#007BFF";
        button.style.cursor = "pointer";

        if (tooltip) tooltip.remove();
    });
}
