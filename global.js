var ENV = {
    "urlFullNode": "https://testnet.incognito.org/fullnode",
    "urlCoinService": "https://api-coinservice-staging.incognito.org",
    "urlPubsubService": "http://51.161.117.193:9096",
    "urlBackend": "https://staging-api-service.incognito.org",
    "urlBackendTool": "http://34.123.53.141",
    "urlWeb3": "https://kovan.infura.io/v3/",
    "urlWebService": "https://api-webapp-staging.incognito.org"
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