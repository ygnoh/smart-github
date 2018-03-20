// default regex that will never match anything
let rxGithubIssuesOrPulls = /(?!)/;

fetchHosts().then(hosts => {
    const rxHosts = hosts.join("|");
    rxGithubIssuesOrPulls = new RegExp(`^https?:\/\/(www\.)?(?:${rxHosts})\/.*?\/(?:issues|pulls)\/?$`, "i");
});

chrome.webNavigation.onCompleted.addListener(function(details) {
    const {url, tabId} = details;

    if (rxGithubIssuesOrPulls.test(url)) {
        chrome.tabs.sendMessage(tabId, "page-refreshed");
    }
});

let currentUrl;
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    currentUrl = changeInfo.url || currentUrl;
    if (changeInfo.status === "complete" && rxGithubIssuesOrPulls.test(currentUrl)) {
        chrome.tabs.sendMessage(tabId, "url-updated");
    }
});

function fetchHosts() {
    return new Promise((resolve, reject) => {
            chrome.storage.sync.get({"sg-hosts": []}, result => {
            const defaultHost = "github.com";
            const hosts = result["sg-hosts"] || [defaultHost];

            resolve(hosts);
        });
    });
}