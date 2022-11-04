const { getLogger } = require("./LoggingManager");
const logger = getLogger("ContentManager")
ContentManager = {};

let listAdding = [];

const addContent = async (key, value) => {
    logger.debug(key, value);
    listAdding.push({ key, value });
};

const resetContent = async () => {
    listAdding = [];
};

const getContent = () => {
    return listAdding;
};

module.exports = {
    addContent,
    getContent,
    resetContent
};