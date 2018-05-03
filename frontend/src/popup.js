import "./popup.css";
import {storage, dom} from "./utils";

storage.getHosts().then(hosts => {
    const hostListContainer = dom.getHostList();

    hosts.forEach(host => {
        const item = document.createElement("li");
        item.innerHTML = host;
        hostListContainer.appendChild(item);
    });
});

storage.getUsernames().then(usernames => {
    const usernameListContainer = dom.getUsernameList();

    usernames.forEach(username => {
        const item = document.createElement("li");
        item.innerHTML = username;
        usernameListContainer.appendChild(item);
    });
});

let prevTarget = document.querySelector(".sg-popup-host");
[].forEach.call(dom.getPopupBtns(), btn => {
    btn.addEventListener("change", e => {
        prevTarget.classList.remove("is-on");
        const target = document.querySelector(e.target.dataset.target);
        target.classList.add("is-on");
        prevTarget = target;
    });
});
dom.getHostSaveBtn().addEventListener("click", saveHost);
dom.getHostResetBtn().addEventListener("click", storage.resetHosts.bind(storage));
dom.getUsernameSaveBtn().addEventListener("click", saveUsername);
dom.getUsernameResetBtn().addEventListener("click", storage.resetUsernames.bind(storage));
dom.getFooterForm().addEventListener("submit", e => {
    e.preventDefault();
});

function saveHost() {
    const input = dom.getFooterInput();
    let newHost = input.value.trim();
    // 입력 받은 host에 www. 값이 있다면 제거
    newHost = newHost.replace(/^www\./, "");
    if (newHost === "") {
        return;
    }

    storage.setHosts(newHost);
}

function saveUsername() {
    const username = dom.getFooterInput().value.trim();

    if (username === "") {
        return;
    }

    storage.setUsername(username);
}