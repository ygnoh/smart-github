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
    }
};

export {
    storage
};