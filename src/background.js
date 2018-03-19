let rxGithubIssuesOrPulls;
chrome.storage.sync.get("sg-hosts", result => {
    const defaultHost = "github.com";
    const hosts = result["sg-hosts"] || [];
    hosts.push(defaultHost);

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