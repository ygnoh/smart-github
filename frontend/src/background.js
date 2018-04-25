import * as firebase from "firebase/app";
import "firebase/messaging";
import {storage} from "./utils";
import {MESSAGE} from "./consts";

// init Firebase
const config = {
    apiKey: "AIzaSyD7maFJ1fc_lGPQev9Jiyse53AgtCybpJg",
    authDomain: "smart-github.firebaseapp.com",
    databaseURL: "https://smart-github.firebaseio.com",
    projectId: "smart-github",
    storageBucket: "smart-github.appspot.com",
    messagingSenderId: "767779176892"
};
firebase.initializeApp(config);

// default regex that will never match anything
let rxIssueTab = /(?!)/;
let rxPRTab = /(?!)/;
let rxNewIssuePage = /(?!)/;
let rxNewPRPageFromPRTab = /(?!)/;
let rxIssueContentsPage = /(?!)/;

updateRegexp();

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.name === MESSAGE.HOSTS_UPDATED) {
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
        chrome.tabs.sendMessage(tabId, {name: MESSAGE.ISSUE_TAB_LOADED});
    } else if (rxPRTab.test(url)) {
        // 아직 불필요하므로 주석 처리
        // chrome.tabs.sendMessage(tabId, {name: MESSAGE.PR_TAB_LOADED});
    } else if (rxNewIssuePage.test(url)) {
        chrome.tabs.sendMessage(tabId, {name: MESSAGE.NEW_ISSUE_PAGE_LOADED});
    } else if (rxIssueContentsPage.test(url)) {
        chrome.tabs.sendMessage(tabId, {name: MESSAGE.ISSUE_CONTENTS_PAGE_LOADED});
    } else if (rxNewPRPageFromPRTab.test(url)) {
        // [#62] 동작 임시 제한
        // chrome.tabs.sendMessage(tabId, {name: MESSAGE.NEW_PR_PAGE_LOADED});
    }
}