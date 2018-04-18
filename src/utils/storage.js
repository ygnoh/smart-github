import {MESSAGE} from "../consts";

/** chrome.storage 관련 작업을 처리하는 객체  */
export default {
    get: chrome.storage.sync.get,
    set: chrome.storage.sync.set,
    remove: chrome.storage.sync.remove,
    /**
     * 현재 저장된 hosts를 얻는다.
     * @returns {Array} 저장된 hosts
     */
    getHosts: function () {
        return new Promise((resolve, reject) => {
            this.get("sg-hosts", result => {
                const defaultHost = "github.com";
                const hosts = result["sg-hosts"] || [defaultHost];

                resolve(hosts);
            });
        });
    },
    /**
     * 새 host를 추가하고, 페이지를 새로고침한다.
     * @param {string} newHost 새로 추가할 host
     */
    setHosts: async function (newHost) {
        const hosts = await this.getHosts();

        // prevent duplicate hosts
        if (hosts.includes(newHost)) {
            return;
        }

        hosts.push(newHost);

        this.set({ "sg-hosts": hosts }, () => {
            chrome.runtime.sendMessage({ name: MESSAGE.HOSTS_UPDATED }, () => {
                location.reload();
            });
        });
    },
    /**
     * 저장된 hosts를 모두 reset하고 페이지를 새로고침한다.
     */
    resetHosts: function () {
        this.remove("sg-hosts", () => {
            chrome.runtime.sendMessage({ name: MESSAGE.HOSTS_UPDATED }, () => {
                location.reload();
            });
        });
    },
    /**
     * 현재 저장소의 token을 얻는다.
     * @returns {string} 현재 저장소의 token
     */
    getToken: function () {
        return new Promise((resolve, reject) => {
            const tokenKey = `sg-token(${location.host})`;
            this.get(tokenKey, result => {
                const token = result[tokenKey];

                resolve(token);
            });
        });
    },
    /**
     * 현재 저장소의 token을 새로 저장하고, 페이지를 새로고침한다.
     */
    setToken: function () {
        const key = `sg-token(${location.host})`;
        const token = document.getElementById("sg-token").value;

        this.set({ [key]: token }, () => {
            alert(chrome.i18n.getMessage("tokenSaved"));
            location.reload();
        });
    },
    /**
     * 현재 저장소의 '템플릿-레이블' map을 얻는다.
     * @returns {Object} 템플릿 이름을 키로 가지고, 해당 레이블들을 값으로 가지는 객체
     */
    getTemplateNameToLabelsMap: function () {
        const key = `templateNameToLabels(${location.host})`;

        return new Promise((resolve, reject) => {
            this.get([key], result => {
                resolve(result[key] || {});
            });
        });
    },
    /**
     * 하나의 '템플릿-레이블' map을 upsert한다.
     * @param {Object} newMap 새로운 '템플릿 이름-레이블' 객체
     */
    setTemplateNameToLabelsMap: function (newMap) {
        const key = `templateNameToLabels(${location.host})`;

        this.get(key, result => {
            const oldMap = result[key];
            this.set({
                [key]: Object.assign({}, oldMap, newMap)
            });
        });
    }
}