/** ajax 호출과 관련 작업을 처리하는 객체 */
export default {
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
}