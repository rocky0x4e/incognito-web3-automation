var ENV = {
    FullNode: { url: "https://testnet.incognito.org/fullnode", authPath: "" },
    CoinService: { url: "https://api-coinservice-staging.incognito.org", authPath: "auth/new-token" },
    PubsubService: { url: "http://51.161.117.193:9096", authPath: "" },
    Backend: { url: "https://staging-api-service.incognito.org", authPath: "auth/new-token" },
    BackendTool: { url: "http://34.123.53.141", authPath: "" },
    Web3: { url: "https://kovan.infura.io/v3/", authPath: "" },
    WebService: { url: "https://api-webapp-staging.incognito.org", authPath: "" }
}

const os = require("os")
var DEVICE_ID = 'E5879478-BAC2-4F61-9666-ED10FE1CFF11'
var DEVICE_TOKEN = "d86fLH6M89Q:APA91bGIlqIBpUczDapIP0lIPYXuBS996k8K15PV6jbNTWO53lLZontF0b8gd2NWrdpg5A-imdVd_rOcGmvH-fkMaLuXFHJA3ksdRioMUg_pTObKvbCBWUN-n45oR4SVsbX30-h07P98"


let config = require("./config.json")
let envName = (typeof process.env.ENV == "undefined") ? config.environment : process.env.ENV
const { getLogger } = require("./lib/Utils/LoggingManager")
const logger = getLogger("global")
try {
    logger.info(`Loading environment: ${envName}`)
    ENV = require(`./environments/${envName}.json`)
} catch (error) {
    throw `Environment "${envName}" not found, HALT: ${error}`
}

module.exports = { ENV, DEVICE_ID, DEVICE_TOKEN }