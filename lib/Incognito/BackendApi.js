const { BaseApi } = require("../Base/BaseApi");

class BackendApi extends BaseApi {
    async aaa({
        TokenIDs
    }) {
        let path = `coins/tokeninfo`
        let body = {
            "TokenIDs": TokenIDs
        }
        return this.post(path, body)
    }
}

module.exports = { BackendApi }