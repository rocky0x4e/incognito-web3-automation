const config = require('../../../constant/config');
const sdkCommonFunction = require('../../../constant/sdkCommonFunction');
const chainCommonFunction = require('../../../constant/chainCommonFunction');
const commonFunction = require('../../../constant/commonFunction');
const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const backendApi_schemas = require("../../../schemas/backendApi_schemas");
const addingContent = require('../../../testbase/addingContent');

//Require the dev-dependencies
let chai = require('chai');
const { ENV } = require('../../../global');
const { BackendApi } = require('../../../lib/Incognito/BackendApi');

describe('[Class] Login', () => {

    let backendApi = new BackendApi(ENV.Backend)

    describe('TC001_Profile', async() => {
        it('CallAPI', async() => {
            let response = await backendApi.authProfile()

            await validateSchemaCommand.validateSchema(backendApi_schemas.authenProfileSchemas, response.data)
        })
    })

    describe('TC002_DisableFunctionConfig', async() => {
        it('CallAPI', async() => {
            let response = await backendApi.disableFunctionConfig()

            await validateSchemaCommand.validateSchema(backendApi_schemas.disableFunctionConfigSchemas, response.data)
        })
    })
})