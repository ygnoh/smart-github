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

        const advancedIssueButton = _generateAdvancedIssueButton(newIssueUrl);
        subnav.innerHTML += advancedIssueButton;

        _generateMenuItems(newIssueUrl).then(menuItems => {
            document.getElementById("select-menu-item-container").innerHTML = menuItems;
        });
    }
});

function _generateAdvancedIssueButton(newIssueUrl = "#") {
    return `
        <div class="select-menu d-inline-block js-menu-container js-select-menu float-right">
            <div class="BtnGroup">
                <a href="${newIssueUrl}" class="btn btn-primary BtnGroup-item">New issue</a>
                <button class="btn btn-primary select-menu-button BtnGroup-item js-menu-target" aria-expanded="false"></button>
            </div>
            <div class="select-menu-modal-holder">
                <div class="select-menu-modal">
                    <div id="select-menu-item-container" class="select-menu-list js-navigation-container js-active-navigation-container">
                        Loading...
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function _generateMenuItems(newIssueUrl) {
    const templateData = await _getTemplateData();
    const items = [];

    for (const templateDatum of templateData) {
        const tempName = _extractTemplateName(templateDatum);
        const href = newIssueUrl + "?template=" + tempName + ".md&labels=" + tempName;
        const item = `
            <div class="select-menu-item js-navigation-item">
                <div class="select-menu-item-text">
                    <a href=${href} class="select-menu-item-heading">${tempName}</span>
                </div>
            </div>
        `;
        items.push(item);
    }

    return items.join("");
}

async function _getTemplateData() {
    const host = location.protocol + "//" +
        (location.host === "github.com" ? "api.github.com" : (location.host + "/api/v3"));

    const match = location.pathname.match(/([^\/]+)\/([^\/]+)/);
    const username = match[1];
    const reponame = match[2];

    // https://developer.github.com/v3/repos/contents/
    const url = `${host}/repos/${username}/${reponame}/contents/.github/ISSUE_TEMPLATES`;

    let templateData;
    await fetch(url)
        .then(res => res.json())
        .then(data => {
            templateData = data;
        })
        .catch(err => {
            console.error(err);
        });

    return templateData;
}

function _extractTemplateName(templateDatum) {
    const match = templateDatum.name.match(/(.*).md$/i);
    return match[1];
}