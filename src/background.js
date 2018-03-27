// default regex that will never match anything
let rxIssueTab = /(?!)/;
let rxPRTab = /(?!)/;
let rxNewIssuePage = /(?!)/;

updateRegexp();

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.name === "hosts-updated") {
        updateRegexp();
    }
});

chrome.webNavigation.onCompleted.addListener(function(details) {
    const {url, tabId} = details;

    if (rxValidUrl.test(url)) {
        chrome.tabs.sendMessage(tabId, {name: "issue-pr-page-loaded"});
    } else if (rxNewIssuePage.test(url)) {
        chrome.tabs.sendMessage(tabId, {name: "new-issue-page-loaded"});
    }
});

let currentUrl;
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    currentUrl = changeInfo.url || currentUrl;
    if (changeInfo.status === "complete") {
        if (rxValidUrl.test(currentUrl)) {
            chrome.tabs.sendMessage(tabId, {name: "issue-pr-page-loaded"});
        } else if (rxNewIssuePage.test(currentUrl)) {
            chrome.tabs.sendMessage(tabId, {name: "new-issue-page-loaded"});
        }
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

function updateRegexp() {
    fetchHosts().then(hosts => {
        const rxHosts = hosts.join("|");
        rxValidUrl = new RegExp(`^https?:\/\/(www\.)?(?:${rxHosts})\/.*?\/(?:issues|pulls)\/?$`, "i");
        rxNewIssuePage = new RegExp(`^https?:\/\/(www\.)?(?:${rxHosts})\/.*?\/issues\/new\?.*?template=.*?\.md`, "i");
    });
}