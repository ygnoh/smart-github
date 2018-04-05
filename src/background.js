import {storage} from "./util";

// default regex that will never match anything
let rxIssueTab = /(?!)/;
let rxPRTab = /(?!)/;
let rxNewIssuePage = /(?!)/;
let rxNewPRPageFromPRTab = /(?!)/;
let rxIssueContentsPage = /(?!)/;

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

function updateRegexp() {
    storage.getHosts().then(hosts => {
        const rxHosts = hosts.join("|");

        // 다음에 매칭된다: .../issues, .../issues/, .../issues?{anything}
        rxIssueTab = new RegExp(`^https?://(www\\.)?(?:${rxHosts})/.*?/issues(?:/?$|\\?)`, "i");

        // 다음에 매칭된다: .../pulls, .../pulls/
        rxPRTab = new RegExp(`^https?://(www\\.)?(?:${rxHosts})/.*?/pulls/?$`, "i");

        // 다음에 매칭된다: .../issues/new?{anything}template={anything}.md{anything}
        rxNewIssuePage = new RegExp(`^https?://(www\\.)?(?:${rxHosts})/.*?/issues/new\\?.*?template=.*?\\.md`, "i");

        // 다음에 매칭된다: .../issues/{any number}, .../issues/{any number}/
        rxIssueContentsPage = new RegExp(`^https?://(www\\.)?(?:${rxHosts})/.*?/issues/[0-9]+/?$`, "i");

        // 다음에 매칭된다: .../compare/{anything except /}...{anything except /}{anything}
        rxNewPRPageFromPRTab = new RegExp(`^https?://(www\\.)?(?:${rxHosts})/.*?/compare/[^/]+?\\.{3}[^/]+`, "i");
    });
}

function sendMessage({url, tabId}) {
    if (rxIssueTab.test(url)) {
        chrome.tabs.sendMessage(tabId, {name: "issue-tab-loaded"});
    } else if (rxPRTab.test(url)) {
        chrome.tabs.sendMessage(tabId, {name: "pr-tab-loaded"});
    } else if (rxNewIssuePage.test(url)) {
        chrome.tabs.sendMessage(tabId, {name: "new-issue-page-loaded"});
    } else if (rxIssueContentsPage.test(url)) {
        chrome.tabs.sendMessage(tabId, {name: "issue-contents-page-loaded"});
    } else if (rxNewPRPageFromPRTab.test(url)) {
        // [#62] 동작 임시 제한
        // chrome.tabs.sendMessage(tabId, {name: "new-pr-page-loaded"});
    }
}