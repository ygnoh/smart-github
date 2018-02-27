let newIssueUrl = "#";

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg === "url-updated" || msg === "page-refreshed") {
        const newIssueButton = document.querySelector('a.btn[href$="/issues/new"]')
        // onUpdated 이벤트가 페이지가 이동하기 전에 발생하여 생기는 TypeError 임시 방어 처리
        if (!newIssueButton) {
            return;
        }

        newIssueUrl = newIssueButton.getAttribute("href");
        const subnav = newIssueButton.parentNode;

        subnav.removeChild(newIssueButton);

        const advancedIssueButton = generateAdvancedIssueButton();
        subnav.innerHTML += advancedIssueButton;

        chrome.storage.sync.get("label", function(data) {
            // TODO: label을 배열로 받도록 처리. option.js과 함께 수정
            const labels = [data.label];
            const items = generateMenuItemsFromLabels(labels);
            document.getElementById("select-menu-item-container").innerHTML = items;
        });
    }
});

// TODO: Need to refactor
function generateAdvancedIssueButton() {
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

function generateMenuItemsFromLabels(labels) {
    let items = [];

    for (const label of labels) {
        const href = newIssueUrl + "?template=" + label + ".md&labels=" + label;
        const item = `
            <div class="select-menu-item js-navigation-item">
                <div class="select-menu-item-text">
                    <a href=${href} class="select-menu-item-heading">${label}</span>
                </div>
            </div>
        `;
        items.push(item);
    }

    return items.join("");
}