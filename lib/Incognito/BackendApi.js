const { BaseApi } = require("../Base/BaseApi");

class BackendApi extends BaseApi {

    async authProfile() {
        let path = `auth/profile`
        return this.getWithAuth(path)
    }

    async disableFunctionConfig() {
        let path = `system/disable-function-configs`
        return this.get(path)
    }

    async lastVersion() {
        let path = `system/ios/last-version`
        return this.get(path)
    }
}


module.exports = { BackendApi }