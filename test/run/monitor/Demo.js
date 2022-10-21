const config = require('../../../constant/config');
const cliCommonFunction = require('../../../constant/cliCommonFunction');
const sdkCommonFunction = require('../../../constant/sdkCommonFunction');
const chainCommonFunction = require('../../../constant/chainCommonFunction');
const commonFunction = require('../../../constant/commonFunction');
const coinServiceApi = require('../../../models/coinServiceApi');
const validateSchemaCommand = require("../../../schemas/validateSchemaCommand");
const coinServiceApi_schemas = require("../../../schemas/coinServiceApi_schemas");
const addingContent = require('../../../testbase/addingContent');

const { IncAccount, IncAccountGroup } = require("../../../lib/Incognito/Account")
const { IncNode } = require("../../../lib/Incognito/IncNode")
const CoinServiceApi = require('../../../lib/Incognito/CoinService/CoinServiceApi');

//Require the dev-dependencies
let chai = require('chai');



const run = async() => {
    let cd = new coinServiceApi
}

run()