const config = require('../../../constant/config');
const sdkCommonFunction = require('../../../constant/sdkCommonFunction');
const chainCommonFunction = require('../../../constant/chainCommonFunction');
const commonFunction = require('../../../constant/commonFunction');
const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const backendApi_schemas = require("../../../schemas/backendApi_schemas");
const addingContent = require('../../../testbase/addingContent');

//Require the dev-dependencies
let chai = require('chai');
const { IncAccount } = require('../../../lib/Incognito/Account/Account');
const { IncNode } = require('../../../lib/Incognito/IncNode');
const { ENV } = require('../../../global');
const { BackendApi } = require('../../../lib/Incognito/BackendApi');

describe('[Class] Balance', () => {


    let backendApi = new BackendApi(ENV.Backend)

    describe('TC001_Profile', async() => {
        it('CallAPI', async() => {
            let response = await backendApi.authProfile()

            await validateSchemaCommand.validateSchema(backendApi_schemas.authenProfileSchemas, response.data)
        })
    })
})