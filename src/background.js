// default regex that will never match anything
let rxHomeRepoPage = /(?!)/;
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

        // 다음에 매칭된다: .../{anything except /}/{anything except /}, .../{anything except /}/{anything except /}/
        rxHomeRepoPage = new RegExp(`^https?://(www\\.)?(?:${rxHosts})/[^/]+?/[^/]+?/?$`, "i");

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
    if (rxHomeRepoPage.test(url)) {
        chrome.tabs.sendMessage(tabId, {name: "home-repo-page-loaded"});
    } else if (rxIssueTab.test(url)) {
        chrome.tabs.sendMessage(tabId, {name: "issue-tab-loaded"});
    } else if (rxPRTab.test(url)) {
        chrome.tabs.sendMessage(tabId, {name: "pr-tab-loaded"});
    } else if (rxNewIssuePage.test(url)) {
        chrome.tabs.sendMessage(tabId, {name: "new-issue-page-loaded"});
    } else if (rxIssueContentsPage.test(url)) {
        chrome.tabs.sendMessage(tabId, {name: "issue-contents-page-loaded"});
    } else if (rxNewPRPageFromPRTab.test(url)) {
        chrome.tabs.sendMessage(tabId, {name: "new-pr-page-loaded"});
    }
}