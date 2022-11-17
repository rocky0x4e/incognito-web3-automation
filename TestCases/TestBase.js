const addContext = require('mochawesome/addContext');
const { ENV } = require('../global');
const { EvmAccountGroup } = require('../lib/EVM/Account');
const { IncAccountGroup } = require('../lib/Incognito/Account/Account');
const { IncNode } = require('../lib/Incognito/IncNode');
const addingContent = require("../lib/Utils/AddingContent");
const { getLogger } = require('../lib/Utils/LoggingManager');
const logger = getLogger("TestBase")

const NODES = {
    Incognito: new IncNode(ENV.Testbed.Incognito.FullNode),
    Evm: {}
}

const ACCOUNTS = {
    Incognito: (new IncAccountGroup()).importKeyList(ENV.Testdata.Keys.Incognito, NODES.Incognito),
    Evm: (new EvmAccountGroup()).importKeyList(ENV.Testdata.Keys.EVM)
}

beforeEach(function() {
    addingContent.resetContent()
})

afterEach(function() {

    for (const item of addingContent.getContent()) {
        if (item.value) {
            logger.debug({ item });
            addContext(this, {
                title: item.key,
                value: item.value
            });
        } else {
            logger.debug(item.key);
            addContext(this, {
                title: 'log',
                value: item.key
            });
        }

    }
})

module.exports = { ACCOUNTS, NODES }