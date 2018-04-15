/** chrome.storage 관련 작업을 처리하는 객체  */
const storage = {
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
            chrome.runtime.sendMessage({ name: "hosts-updated" }, () => {
                location.reload();
            });
        });
    },
    /**
     * 저장된 hosts를 모두 reset하고 페이지를 새로고침한다.
     */
    resetHosts: function () {
        this.remove("sg-hosts", () => {
            chrome.runtime.sendMessage({ name: "hosts-updated" }, () => {
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
};

/** ajax 호출과 관련 작업을 처리하는 객체 */
const fetcher = {
    /**
     * URL과 token을 받아 fetch하는 함수
     * @param {string} url fetch 하고자하는 URL 정보
     * @param {string} [token=undefined] fetch에 사용할 token
     * @returns {Object} 해당 URL로부터 fetch한 객체
     */
    fetch: function ({ url, token }) {
        const requestInit = {};
        if (token) {
            requestInit.headers = {
                Authorization: `token ${token}`
            };
        }

        return new Promise((resolve, reject) => {
            fetch(url, requestInit)
                .then(resolve)
                .catch(reject);
        });
    }
};

/** URL 관련 작업을 처리하는 객체 */
const urlManager = {
    /**
     * github API 호출에 필요한 기본 정보를 리턴하는 함수
     * @returns {Object} host, username, repository name을 가지는 객체
     */
    _getApiInfo: function () {
        const host = location.protocol + "//" +
            (location.host === "github.com" ? "api.github.com" : (location.host + "/api/v3"));

        const match = location.pathname.match(/([^\/]+)\/([^\/]+)/);
        const username = match[1];
        const reponame = match[2];

        return {
            host,
            username,
            reponame
        };
    },
    /**
     * .github/ISSUE_TEMPLATE에 저장된 파일을 읽기 위한 API URL을 제공하는 함수
     * https://developer.github.com/v3/repos/contents/
     * @returns {string} 이슈 템플릿 디렉토리에 접근하기 위한 API URL
     */
    getIssueTemplateApiUrl: function () {
        const {host, username, reponame} = this._getApiInfo();

        return `${host}/repos/${username}/${reponame}/contents/.github/ISSUE_TEMPLATE`;
    },
    /**
     * .github/PULL_REQUEST_TEMPLATE에 저장된 파일을 읽기 위한 API URL을 제공하는 함수
     * https://developer.github.com/v3/repos/contents/
     * @returns {string} PR 템플릿 디렉토리에 접근하기 위한 API URL
     */
    getPrTemplateApiUrl: function () {
        const {host, username, reponame} = this._getApiInfo();

        return `${host}/repos/${username}/${reponame}/contents/.github/PULL_REQUEST_TEMPLATE`;
    },
    /**
     * 특정 이슈 템플릿 파일의 정보를 읽기 위한 API URL을 제공하는 함수
     * https://developer.github.com/v3/repos/contents/#get-contents
     * @param {string} fileName 이슈 템플릿 파일의 이름
     * @returns {string} 해당 파일에 접근하기 위한 API URL
     */
    getFileInfoApiUrl: function (fileName) {
        const {host, username, reponame} = _getApiInfo();

        return `${host}/repos/${username}/${reponame}/contents/.github/ISSUE_TEMPLATE/${fileName}.md`;
    },
    /**
     * 저장된 토큰들을 볼 수 있는 페이지 URL을 제공하는 함수
     * @returns {string} 토큰 페이지 URL
     */
    getTokenListPageUrl: function () {
        return `${location.protocol}//${location.host}/settings/tokens`;
    },
    /**
     * 새 토큰을 생성하는 페이지 URL을 제공하는 함수
     * @returns {string} 새 토큰을 생성하는 페이지 URL
     */
    getNewTokenPageUrl: function () {
        return `${location.protocol}//${location.host}/settings/tokens/new?` +
            `scopes=repo&description=SmartGithub(${location.host})`;
    },
    /**
     * 현재 페이지에 적용된 템플릿의 이름을 알려주는 함수
     * @returns {string} 템플릿 이름
     */
    getCurrentTemplate: function () {
        return location.search.match(/template=(.*?)\.md/i)[1];
    }
};

export {
    storage,
    fetcher,
    urlManager
}; 