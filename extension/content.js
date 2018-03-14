chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg === "url-updated" || msg === "page-refreshed") {
        const newIssueButton = document.querySelector('a.btn[href$="/issues/new"]')
        // onUpdated 이벤트가 페이지가 이동하기 전에 발생하여 생기는 TypeError 임시 방어 처리
        if (!newIssueButton) {
            return;
        }

        const newIssueUrl = newIssueButton.getAttribute("href");
        const subnav = newIssueButton.parentNode;
        subnav.removeChild(newIssueButton);

        const dropdown = _createDropdown();
        const newIssueBtn = _createNewIssueBtn(newIssueUrl);
        const dropdownContent = _createDropdownContent();
        const loadingMsg = _createLoadingMsg();

        dropdownContent.appendChild(loadingMsg);
        dropdown.append(newIssueBtn, dropdownContent);
        subnav.appendChild(dropdown);

        _fetchTemplateData().then(data => {
            data.newIssueUrl = newIssueUrl;

            const menuContents = _createMenuContents(data);
            dropdownContent.replaceChild(menuContents, loadingMsg);
        });
    }
});

function _createDropdown() {
    const dropdown = document.createElement("div");
    dropdown.classList.add("sg-dropdown", "float-right");

    return dropdown;
}

function _createNewIssueBtn(href = "#") {
    const newIssueBtn = document.createElement("a");
    newIssueBtn.classList.add("sg-dropbtn");
    newIssueBtn.href = href;
    newIssueBtn.innerHTML = "New Issue";

    return newIssueBtn;
}

function _createDropdownContent() {
    const dropdownContent = document.createElement("div");
    dropdownContent.classList.add("sg-dropdown-content");

    return dropdownContent;
}

function _createLoadingMsg() {
    const loadingMsg = document.createElement("p");
    loadingMsg.innerHTML = "Loading...";

    return loadingMsg;
}

async function _fetchTemplateData() {
    const host = location.protocol + "//" +
        (location.host === "github.com" ? "api.github.com" : (location.host + "/api/v3"));

    const match = location.pathname.match(/([^\/]+)\/([^\/]+)/);
    const username = match[1];
    const reponame = match[2];

    // https://developer.github.com/v3/repos/contents/
    const url = `${host}/repos/${username}/${reponame}/contents/.github/ISSUE_TEMPLATE`;

    const requestInit = {
        cache: false
    };

    let response;
    await fetch(url, requestInit)
        .then(res => {
            response = res;
        })
        .catch(err => {
            console.error(err);
        });

    let templateData = {
        ok: response.ok,
        status: response.status
    };

    // TODO: 어떨 땐 JSON 어떨 땐 DOM? 일관성 필요함
    if (response.ok) {
        templateData.contents = await _convertReadableStreamToJson(response);
    } else {
        templateData.contents = _getContentsOnError(response.status);
    }

    return templateData;
}

async function _convertReadableStreamToJson(res) {
    let jsonData;
    await res.json().then(data => {jsonData = data});

    return jsonData;
}

// TODO: refactor to HTML
function _getContentsOnError(status) {
    switch (status) {
        case 404:
            return `
                비공개 저장소에서 정상적인 기능을 이용하려면 access token이 필요합니다.
                <a class="sg-new-token" href="${_getNewTokenUrl()}" target="_blank">이 링크</a>를
                통해서 생성하고, 아래에 붙여 넣어주세요.
                <input id="sg-token" type="text" placeholder="이 곳에 토큰을 넣어주세요" autocomplete="off">
            `;
        default:
            return "Unknown error occurs.";
    }
}

function _getNewTokenUrl() {
    return `${location.protocol}//${location.host}/settings/tokens/new?scopes=repo&description=SmartGithub`;
}

function _createMenuContents(data) {
    const dropdownContents = document.createElement("div");

    if (!data.ok) {
        // event bind 문제로 저장 버튼은 따로 삽입함
        const savebtn = _createSaveTokenBtn();
        dropdownContents.innerHTML = data.contents;
        dropdownContents.appendChild(savebtn);

        return dropdownContents;
    }

    const {contents, newIssueUrl} = data;
    const templateNames = _extractTemplateNames(contents);

    for (const tempName of templateNames) {
        const href = newIssueUrl + "?template=" + tempName + ".md&labels=" + tempName;
        const item = `<a href=${href}>${tempName}</span>`;

        dropdownContents.innerHTML += item;
    }

    return dropdownContents;
}

function _createSaveTokenBtn() {
    const savebtn = document.createElement("button");
    savebtn.addEventListener("click", _saveToken);
    savebtn.innerHTML = "저장";

    return savebtn;
}

function _saveToken() {
    const token = document.getElementById("sg-token").value;
    console.log(token);
}

function _extractTemplateNames(contents) {
    let templateNames = [];

    for (const content of contents) {
        const match = content.name.match(/(.*).md$/i);
        templateNames.push(match[1]);
    }

    return templateNames;
}