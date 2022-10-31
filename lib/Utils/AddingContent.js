const { LOGGER } = require("./LoggingManager");

let listAdding = [];

const addContent = async (key, value) => {
    LOGGER.debug(key, value);
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
    resetContent,
};