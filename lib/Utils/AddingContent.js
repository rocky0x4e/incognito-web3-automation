const { getLogger } = require("./LoggingManager");
const logger = getLogger("AddContent")
let listAdding = [];
let listDebug = [];

const addContent = async (key, value) => {
    logger.debug(key, value),
        listAdding.push({ key, value });
};

const addDebug = async (key, value) => {
    logger.debug(key, value),
        listDebug.push({ key, value });
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