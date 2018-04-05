const storage = {
    get: chrome.storage.sync.get,
    set: chrome.storage.sync.set,
    getHosts: function() {
        return new Promise((resolve, reject) => {
            this.get("sg-hosts", result => {
                const defaultHost = "github.com";
                const hosts = result["sg-hosts"] || [defaultHost];

                resolve(hosts);
            });
        });
    },
    getToken: function() {
        return new Promise((resolve, reject) => {
            const tokenKey = `sg-token(${location.host})`;
            this.get(tokenKey, result => {
                const token = result[tokenKey];

                resolve(token);
            });
        });
    },
    setToken: function() {
        const key = `sg-token(${location.host})`;
        const token = document.getElementById("sg-token").value;

        this.set({[key]: token}, () => {
            alert(chrome.i18n.getMessage("tokenSaved"));
            location.reload();
        });
    },
    getTemplateNameToLabelsMap: function() {
        const key = `templateNameToLabels(${location.host})`;

        return new Promise((resolve, reject) => {
            this.get([key], result => {
                resolve(result[key] || {});
            });
        });
    },
    setTemplateNameToLabelsMap: function(newMap) {
        const key = `templateNameToLabels(${location.host})`;

        this.get(key, result => {
            const oldMap = result[key];
            this.set({
                [key]: Object.assign({}, oldMap, newMap)
            });
        });
    }
};

export {
    storage
};