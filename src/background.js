// default regex that will never match anything
let rxValidUrl = /(?!)/;

updateRxValidUrl();

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg === "hosts-updated") {
        updateRxValidUrl();
    }
});

chrome.webNavigation.onCompleted.addListener(function(details) {
    const {url, tabId} = details;

    if (rxValidUrl.test(url)) {
        chrome.tabs.sendMessage(tabId, "page-refreshed");
    }
});

let currentUrl;
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) { 
    currentUrl = changeInfo.url || currentUrl;
    if (rxValidUrl.test(currentUrl)) {
        changeInfo.status === "complete"? 
            chrome.tabs.sendMessage(tabId, "url-updated") :
            chrome.browserAction.setIcon({ path: "icons/activeIcon.png", tabId: tabId}) 
    } else {
        chrome.browserAction.setIcon({ path: "icons/deactiveIcon.png", tabId: tabId});
    }
});

function fetchHosts() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get("sg-hosts", result => {
            const defaultHost = "github.com";
            const hosts = result["sg-hosts"] || [defaultHost];

            resolve(hosts);
        });
    });
}

function updateRxValidUrl() {
    fetchHosts().then(hosts => {
        const rxHosts = hosts.join("|");
        rxValidUrl = new RegExp(`^https?:\/\/(www\.)?(?:${rxHosts})\/.*?\/(?:issues|pulls)\/?$`, "i");
    });
}