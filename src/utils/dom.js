import {urlManager, storage} from "./index";

/** dom 관련 작업을 처리하는 객체 */
export default {
    getNewIssueBtn() {
        return document.querySelector('a.btn[href$="/issues/new"]');
    },
    getIssueBody() {
        return document.getElementById("issue_body");
    },
    getIssueBottomArea() {
        return document.querySelector(".form-actions");
    },
    getLabels() {
        return document.querySelector(".labels");
    },
    getHostList() {
        return document.querySelector(".sg-host-list");
    },
    getHostSaveBtn() {
        return document.getElementById("sg-host-save");
    },
    getHostResetBtn() {
        return document.getElementById("sg-host-reset");
    },
    getHostInput() {
        return document.getElementById("sg-host-input");
    },
    getHostForm() {
        return document.getElementById("sg-host-form");
    },
    removeResetTemplateBtns() {
        const bottomArea = this.getIssueBottomArea();
        const resetBtns = bottomArea.getElementsByClassName("sg-reset-btn");

        while (resetBtns.length > 0) {
            resetBtns[0].remove();
        }
    },
    createResetTemplateBtn(resetHandler = () => {}) {
        const resetBtn = document.createElement("a");
        resetBtn.classList.add("btn", "sg-reset-btn");
        resetBtn.innerHTML = chrome.i18n.getMessage("resetToTemplate");
        resetBtn.addEventListener("click", resetHandler);

        return resetBtn;
    },
    _createDropdownWrapper() {
        const dropdownWrapper = document.createElement("div");
        dropdownWrapper.classList.add("sg-dropdown-wrapper");

        return dropdownWrapper;
    },
    createRightDropdownWrapper() {
        const dropdownWrapper = this._createDropdownWrapper();
        dropdownWrapper.classList.add("float-right");

        return dropdownWrapper;
    },
    createLeftDropdownWrapper() {
        const dropdownWrapper = this._createDropdownWrapper();
        dropdownWrapper.classList.add("float-left");

        return dropdownWrapper;
    },
    _createDropdown() {
        const dropdown = document.createElement("div");
        dropdown.classList.add("sg-dropdown");

        return dropdown;
    },
    createRightDropdown() {
        const dropdown = this._createDropdown();
        dropdown.classList.add("sg-bottom-right");

        return dropdown;
    },
    createLeftDropdown() {
        const dropdown = this._createDropdown();
        dropdown.classList.add("sg-bottom-left");

        return dropdown;
    },
    createLoadingMsg() {
        const loadingMsg = document.createElement("a");
        loadingMsg.href = "#";
        loadingMsg.innerHTML = chrome.i18n.getMessage("loading");

        return loadingMsg;
    },
    createDropdownContents(data = {}) {
        const dropdownContents = document.createElement("div");
        dropdownContents.classList.add("sg-dropdown-contents");

        if (!data.ok) {
            // event bind 문제로 저장 버튼은 따로 삽입함
            const savebtn = this._createSaveTokenBtn();
            dropdownContents.innerHTML = data.contents;
            dropdownContents.appendChild(savebtn);

            return dropdownContents;
        }

        const { contents, newIssueUrl, labels } = data;
        const templateNames = this._extractTemplateNames(contents);

        for (const tempName of templateNames) {
            let href = `${newIssueUrl}?template=${tempName}.md`;

            if (labels[tempName]) {
                const encodedLabels = encodeURIComponent(labels[tempName].join(","));
                href = `${newIssueUrl}?template=${tempName}.md&labels=${encodedLabels}`;
            }

            const item = `<a href=${href}>${tempName}</a>`;

            dropdownContents.innerHTML += item;
        }

        return dropdownContents;
    },
    _createSaveTokenBtn() {
        const savebtn = document.createElement("button");
        savebtn.addEventListener("click", storage.setToken.bind(storage));
        savebtn.innerHTML = chrome.i18n.getMessage("save");

        return savebtn;
    },
    _extractTemplateNames(contents = []) {
        let names = [];

        for (const content of contents) {
            const match = content.name.match(/(.*).md$/i);
            match && names.push(match[1]);
        }

        return names;
    },
    async createTemplateData(response = {}) {
        let templateData = {
            ok: response.ok,
            status: response.status
        };

        // TODO: 어떨 땐 JSON 어떨 땐 DOM? 일관성 필요함
        if (response.ok) {
            templateData.contents = await this._convertReadableStreamToJson(response);
            templateData.labels = await storage.getTemplateNameToLabelsMap();
        } else {
            templateData.contents = this._getContentsOnError(response.status);
        }

        return templateData;
    },
    async _convertReadableStreamToJson(res = {}) {
        let jsonData;
        await res.json().then(data => {jsonData = data});

        return jsonData;
    },
    _getContentsOnError(status) {
        switch (status) {
            case 401:
                return `${chrome.i18n.getMessage("401error_1")}<br>` +
                    `1. <a class="sg-new-token" href="${urlManager.getTokenListPageUrl()}" target="_blank">` +
                    `${chrome.i18n.getMessage("401error_2")}</a><br>` +
                    `2. <a class="sg-new-token" href="${urlManager.getNewTokenPageUrl()}" target="_blank">` +
                    `${chrome.i18n.getMessage("401error_3")}</a><br>` +
                    `3. ${chrome.i18n.getMessage("401error_4")}<br>` +
                    `<input id="sg-token" type="text"` +
                    `placeholder="${chrome.i18n.getMessage("tokenPlaceholder")}" autocomplete="off">`;
            case 404:
                return `${chrome.i18n.getMessage("404error_1")}<br>` +
                    `1. <a class="sg-new-token" href="${urlManager.getNewTokenPageUrl()}" target="_blank">` +
                    `${chrome.i18n.getMessage("404error_2")}</a><br>` +
                    `2. ${chrome.i18n.getMessage("404error_3")}<br>` +
                    `<input id="sg-token" type="text"` +
                    `placeholder="${chrome.i18n.getMessage("tokenPlaceholder")}" autocomplete="off">`;
            default:
                return chrome.i18n.getMessage("unknownError");
        }
    }
}