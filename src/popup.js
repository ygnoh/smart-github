import "./popup.css";
import {storage} from "./util";

storage.getHosts().then(hosts => {
    const hostListContainer = document.querySelector(".sg-host-list");

    hosts.forEach(host => {
        const item = document.createElement("li");
        item.innerHTML = host;
        hostListContainer.appendChild(item);
    });
});

const saveBtn = document.getElementById("sg-host-save");
const resetBtn = document.getElementById("sg-host-reset");
const input = document.getElementById("sg-host-input");
saveBtn.addEventListener("click", saveHost);
resetBtn.addEventListener("click", storage.resetHosts.bind(storage));
document.getElementById('sg-host-form').addEventListener('submit', e => {
    e.preventDefault();
})

function saveHost() {
    let newHost = input.value.trim();
    // 입력 받은 host에 www. 값이 있다면 제거
    newHost = newHost.replace(/^www\./, "");
    if (newHost === "") {
        return;
    }

    storage.setHosts(newHost);
}