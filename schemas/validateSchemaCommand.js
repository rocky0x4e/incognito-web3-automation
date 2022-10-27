const Ajv = require("ajv");
const definitionsHelper = require("./schema-definitions");

async function getSchemaError(getAjvError) {
    return console.log(
        `Field: ${getAjvError[0]["dataPath"]} is invalid. Cause: ${getAjvError[0]["message"]}`
    );
}

async function validateSchema(userSchema, userData) {
    let ajv = new Ajv({ allErrors: true });
    let valid = ajv.validate(userSchema, userData);
    if (valid) {
        console.log("User data is valid");
    } else {
        console.log("User data is INVALID!");
        console.log(ajv.errors[0]);
        throw new Error(JSON.stringify(ajv.errors[0]));
    }
}

module.exports = {
    getSchemaError,
    validateSchema,
};