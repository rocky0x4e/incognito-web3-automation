const addContext = require('mochawesome/addContext');
const addingContent = require("../lib/Utils/AddingContent");
const { getLogger } = require('../lib/Utils/LoggingManager');
const logger = getLogger("TestBase")
beforeEach(function () {
    addingContent.resetContent()
})

afterEach(function () {

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