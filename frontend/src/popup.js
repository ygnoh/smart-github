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

dom.getHostSaveBtn().addEventListener("click", saveHost);
dom.getHostResetBtn().addEventListener("click", storage.resetHosts.bind(storage));
dom.getHostForm().addEventListener("submit", e => {
    e.preventDefault();
});

function saveHost() {
    const input = dom.getHostInput();
    let newHost = input.value.trim();
    // 입력 받은 host에 www. 값이 있다면 제거
    newHost = newHost.replace(/^www\./, "");
    if (newHost === "") {
        return;
    }

    storage.setHosts(newHost);
}