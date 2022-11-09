const { ENV } = require("../../global");
const { BaseApi } = require("../Base/BaseApi");
const addingContent = require("../Utils/AddingContent");

class PortalServiceApi extends BaseApi {
    constructor(obj = ENV.Testbed.PortalService) {
        super(obj)
    }

    async getestimatedunshieldingfee() {
        let path = `getestimatedunshieldingfee`
        return this.get(path)
    }
}


module.exports = { PortalServiceApi }