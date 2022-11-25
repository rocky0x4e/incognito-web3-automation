const { getLogger } = require("./LoggingManager");
const logger = getLogger("AddContent")
let listAdding = [];

const addContent = async(key, value) => {
    logger.debug(key, value),
        // console.log('hoanh log ', key, value);
        listAdding.push({ key, value });
};

const resetContent = async() => {
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