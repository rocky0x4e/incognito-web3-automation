var ENV = {
    FullNode: { url: "https://testnet.incognito.org/fullnode", authPath: "" },
    CoinService: { url: "https://api-coinservice-staging.incognito.org", authPath: "auth/new-token" },
    PubsubService: { url: "http://51.161.117.193:9096", authPath: "" },
    Backend: { url: "https://staging-api-service.incognito.org", authPath: "" },
    BackendTool: { url: "http://34.123.53.141", authPath: "" },
    Web3: { url: "https://kovan.infura.io/v3/", authPath: "" },
    WebService: { url: "https://api-webapp-staging.incognito.org", authPath: "" }
}

const os = require("os")
var DEVICE_ID = `${os.hostname()}_${os.platform()}`
var DEVICE_TOKEN = `${JSON.stringify(os.userInfo())}`


let config = require("./config.json")
let envName = (typeof process.env.ENV == "undefined") ? config.environment : process.env.ENV
try {
    console.debug(`Loading environment: ${envName}`)
    ENV = require(`./environments/${envName}.json`)
} catch (error) {
    throw `Environment "${envName}" not found, HALT`
}

module.exports = { ENV, DEVICE_ID, DEVICE_TOKEN }