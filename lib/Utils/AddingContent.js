const { getLogger } = require("./LoggingManager");
const GenAction = require("./GenAction");
const logger = getLogger("AddContent")
let listAdding = [];
let listDebug = [];
let maxJsonSize = 50000

const addContent = async (key, value) => {
    if (GenAction.getJsonSize(key) < maxJsonSize && GenAction.getJsonSize(value) < maxJsonSize) {
        logger.debug(key, value),
            listAdding.push({ key, value });
    }
    else {
        listAdding.push({ key: `WARNING : Over maximum JSON size (${maxJsonSize} kb) to log` });
    }
};

const addDebug = async (key, value) => {
    if (GenAction.getJsonSize(key) < maxJsonSize && GenAction.getJsonSize(value) < maxJsonSize) {
        logger.debug(key, value),
            listDebug.push({ key, value });
    }
    else {
        listDebug.push({ key: `WARNING : Over maximum JSON size (${maxJsonSize} kb) to log` });
    }
};

const resetContent = async () => {
    listAdding = [];
    listDebug = [];
};

const getContent = () => {
    return listAdding;
};

const getDebug = () => {
    return listDebug;
};

module.exports = {
    addContent,
    getContent,
    resetContent,
    getDebug,
    addDebug
};