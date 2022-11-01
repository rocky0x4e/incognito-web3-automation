const Ajv = require("ajv");
const { getLogger } = require("./../lib/Utils/LoggingManager");
const logger = getLogger("BaseApi")

async function getSchemaError(getAjvError) {
    return logger.debug(
        `Field: ${getAjvError[0]["dataPath"]} is invalid. Cause: ${getAjvError[0]["message"]}`
    );
}

async function validateSchema(userSchema, userData) {
    let ajv = new Ajv({ allErrors: true });
    let valid = ajv.validate(userSchema, userData);
    if (valid) {
        logger.debug("User data is valid");
    } else {
        logger.debug("User data is INVALID!");
        logger.debug(ajv.errors[0]);
        throw new Error(JSON.stringify(ajv.errors[0]));
    }
}

module.exports = {
    getSchemaError,
    validateSchema,
};