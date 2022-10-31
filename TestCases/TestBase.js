const addContext = require('mochawesome/addContext');
const addingContent = require("../lib/Utils/AddingContent");
const { LOGGER } = require('../lib/Utils/LoggingManager');

beforeEach(function () {
    addingContent.resetContent()
})

afterEach(function () {

    for (const item of addingContent.getContent()) {
        if (item.value) {
            LOGGER.debug({ item });
            addContext(this, {
                title: item.key,
                value: item.value
            });
        } else {
            LOGGER.debug(item.key);
            addContext(this, {
                title: 'log',
                value: item.key
            });
        }

    }
})