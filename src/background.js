const rxGithubIssuesOrPulls = /^https?:\/\/(www\.)?github\.com\/.*?\/(?:issues|pulls)\/?$/;
let currentUrl;

chrome.webNavigation.onCompleted.addListener(function(details) {
    const {url, tabId} = details;

    if (rxGithubIssuesOrPulls.test(url)) {
        chrome.tabs.sendMessage(tabId, "page-refreshed");
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    currentUrl = changeInfo.url || currentUrl;
    if (changeInfo.status === "complete" && rxGithubIssuesOrPulls.test(currentUrl)) {
        chrome.tabs.sendMessage(tabId, "url-updated");
    }
});