const config = require('../../../constant/config');
const sdkCommonFunction = require('../../../constant/sdkCommonFunction');
const chainCommonFunction = require('../../../constant/chainCommonFunction');
const commonFunction = require('../../../constant/commonFunction');
const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const coinServiceApi_schemas = require("../../../schemas/coinServiceApi_schemas");
const addingContent = require('../../../testbase/addingContent');

//Require the dev-dependencies
let chai = require('chai');
const { IncAccount } = require('../../../lib/Incognito/Account/Account');
const { IncNode } = require('../../../lib/Incognito/IncNode');
const { ENV } = require('../../../global');
const { BackendApi } = require('../../../lib/Incognito/BackendApi');

describe('[Class] Balance', () => {

    let account = {
        privateKey: null,
        otaKey: null,
    }
    let backendApi = new BackendApi()

    after('Before_Initdata', async() => {
        it('Initdata', async() => {
            //TODO
        })
    })
})