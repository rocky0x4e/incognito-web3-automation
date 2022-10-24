const { BaseApi } = require("../Base/BaseApi");

class BackendApi extends BaseApi {

    async authProfile() {
        let path = `auth/profile`
        return this.getWithAuth(path)
    }
}


module.exports = { BackendApi }