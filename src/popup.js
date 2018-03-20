fetchHosts().then(hosts => {
    const hostListContainer = document.querySelector(".sg-list-container");

    hosts.forEach(host => {
        const item = document.createElement("li");
        item.innerHTML = host;
        hostListContainer.appendChild(item);
    });
});

const saveBtn = document.getElementById("sg-host-save");
const resetBtn = document.getElementById("sg-host-reset");
const input = document.getElementById("sg-host-input");
saveBtn.addEventListener("click", saveHost);
resetBtn.addEventListener("click", resetHost);

function saveHost() {
    const newHost = input.value.trim();
    
    if (newHost === "") {
        return;
    }

    chrome.storage.sync.get("sg-hosts", result => {
        const defaultHost = "github.com";
        const hosts = result["sg-hosts"] || [defaultHost];

        // prevent duplicate hosts
        if (hosts.includes(newHost)) {
            return;
        }

        hosts.push(newHost);

        chrome.storage.sync.set({"sg-hosts": hosts}, () => {
            chrome.runtime.sendMessage("hosts-updated", () => {
                location.reload();
            });
        });
    });
}

function resetHost() {
    chrome.storage.sync.remove("sg-hosts", () => {
        chrome.runtime.sendMessage("hosts-updated", () => {
            location.reload();
        });
    });
}

async function fetchHosts() {
    return await new Promise((resolve, reject) => {
        chrome.storage.sync.get("sg-hosts", result => {
            const hosts = result["sg-hosts"] || ["github.com"];
            resolve(hosts);
        });
    });
}