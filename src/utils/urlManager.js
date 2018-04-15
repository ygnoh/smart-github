/** URL 관련 작업을 처리하는 객체 */
export default {
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
}