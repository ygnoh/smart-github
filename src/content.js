import "./content.css";
import {storage, fetcher, urlManager, dom} from "./utils";

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.name === "issue-tab-loaded" || msg.name === "issue-contents-page-loaded") {
        const newIssueBtn = dom.getNewIssueBtn();
        // onUpdated 이벤트가 페이지가 이동하기 전에 발생하여 생기는 TypeError 임시 방어 처리
        if (!newIssueBtn) {
            return;
        }

        newIssueBtn.classList.add("sg-dropdown-btn");
        const btnParent = newIssueBtn.parentNode;

        // 뒤로 가기 할 경우 태그가 추가 생성되므로, 이미 생성된 경우 방어 처리
        if (btnParent.classList.contains("sg-dropdown-wrapper")) {
            return;
        }

        if (msg.name === "issue-contents-page-loaded") {
            _convertToSmallBtn(newIssueBtn);
        }

        const dropdownWrapper = dom.createRightDropdownWrapper();
        const dropdown = dom.createRightDropdown();
        const loadingMsg = dom.createLoadingMsg();

        dropdown.appendChild(loadingMsg);
        dropdownWrapper.append(newIssueBtn, dropdown);

        btnParent.appendChild(dropdownWrapper);

        _fetchIssueTemplateData().then(data => {
            data.newIssueUrl = newIssueBtn.getAttribute("href");

            const dropdownContents = dom.createDropdownContents(data);
            dropdown.replaceChild(dropdownContents, loadingMsg);
        });
    } else if (msg.name === "new-issue-page-loaded") {
        const bottomArea = dom.getIssueBottomArea();
        // onUpdated 이벤트가 페이지가 이동하기 전에 발생하여 생기는 TypeError 임시 방어 처리
        if (!bottomArea) {
            return;
        }

        // [#28] 방어 처리
        dom.removeResetTemplateBtns();

        const resetBtn = dom.createResetTemplateBtn(_resetIssueHandler);
        bottomArea.appendChild(resetBtn);

        const submitBtn = bottomArea.getElementsByClassName("btn-primary")[0];

        submitBtn.addEventListener("click", () => {
            const templateName = urlManager.getCurrentTemplate();
            const labelContainer = dom.getLabels().children;
            const labels = [].map.call(labelContainer, label => label.innerText);
        
            storage.setTemplateNameToLabelsMap({[templateName]: labels});
        });
    }
});

async function _fetchIssueTemplateData() {
    const url = urlManager.getIssueTemplateApiUrl();
    const token = await storage.getToken();
    const response = await fetcher.fetch({url, token});

    return await dom.createTemplateData(response);
}

function _resetIssueHandler() {
    if (!window.confirm(chrome.i18n.getMessage("confirmReset"))) {
        return;
    }

    const templateName = urlManager.getCurrentTemplate();
    _fetchIssueTemplateFileInfo(templateName).then(result => {
        const issueBody = dom.getIssueBody();
        // base64 decoding
        const content = _b64DecodeUnicode(result.contents.content);

        issueBody.value = content;
    });
}

async function _fetchIssueTemplateFileInfo(name) {
    const url = urlManager.getFileInfoApiUrl(name);
    const token = await storage.getToken();
    const response = await fetcher.fetch({url, token});

    return await dom.createTemplateData(response);
}

/**
 * github API에서 base64로 인코딩된 문자열을 내려주는데,
 * 단순히 atob() 메서드로는 해결되지 않아 아래의 답변을 이용하였음
 * https://stackoverflow.com/a/30106551/5247212
 */
function _b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function _convertToSmallBtn(largeBtn) {
    largeBtn.classList.add("sg-small-btn");
}