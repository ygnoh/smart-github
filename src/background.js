// default regex that will never match anything
let rxIssueTab = /(?!)/;
let rxPRTab = /(?!)/;
let rxNewIssuePage = /(?!)/;
let rxIssueContents = /(?!)/;

updateRegexp();

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.name === "hosts-updated") {
        updateRegexp();
    }
});

chrome.webNavigation.onCompleted.addListener(function(details) {
    sendMessage(details);
});

let currentUrl;
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    currentUrl = changeInfo.url || currentUrl;
    if (changeInfo.status === "complete") {
        sendMessage({url: currentUrl, tabId});
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
        rxIssueTab = new RegExp(`^https?:\/\/(www\.)?(?:${rxHosts})\/.*?\/issues\/?$`, "i");
        rxPRTab = new RegExp(`^https?:\/\/(www\.)?(?:${rxHosts})\/.*?\/pulls\/?$`, "i");
        rxNewIssuePage = new RegExp(`^https?:\/\/(www\.)?(?:${rxHosts})\/.*?\/issues\/new\?.*?template=.*?\.md`, "i");
        rxIssueContents = new RegExp(`^https?:\/\/(www\.)?(?:${rxHosts})\/.*?\/issues\/[0-9]+\/?$`, "i");
    });
}

function sendMessage({url, tabId}) {
    if (rxIssueTab.test(url)) {
        chrome.tabs.sendMessage(tabId, {name: "issue-tab-loaded"});
    } else if (rxPRTab.test(url)) {
        chrome.tabs.sendMessage(tabId, {name: "pr-tab-loaded"});
    } else if (rxNewIssuePage.test(url)) {
        chrome.tabs.sendMessage(tabId, {name: "new-issue-page-loaded"});
    } else if (rxIssueContents.test(url)) {
        chrome.tabs.sendMessage(tabId, {name: "issue-contents-loaded"});
    }
}