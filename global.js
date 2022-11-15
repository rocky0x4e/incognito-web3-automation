const { getLogger } = require("./lib/Utils/LoggingManager")

const logger = getLogger("global")

var ENV = {
    config: require("./config.json"),
    Testbed: {
        Incognito: {
            FullNode: { url: "", accessToken: "" },
            CoinService: { url: "CS url", },
            PubsubService: { url: "pubsub service url", },
            Backend: { url: "backend url", authPath: "auth/new-token" },
            BackendTool: { url: "backend tool url", },
            WebService: { url: "Web service url" },
            Tokens: {
                PRV: "00000004",
                DAI_UT: "24261434",
                ZIL: "06557fbc"
            },
            Pools: {
                PRV_USDT: "pool id 1",
                PRV_ZIL: "pool id 2"
            },
        },
        Web3: [{ url: "https://kovan.infura.io/v3/" }],
        EthereumFullnode: [{ url: "" }],
        BSCFullnode: [{ url: "https://data-seed-prebsc-1-s1.binance.org:8545" }],
        PLGFullnode: [{ url: "https://polygon-mumbai.g.alchemy.com/v2/V8SP0S8Q-sT35ca4VKH3Iwyvh8K8wTRn" }],
        FTMFullnode: [{ url: "https://rpc.testnet.fantom.network" }],
        AuroraFullnode: [{ url: "https://testnet.aurora.dev" }],
        AvaxFullnode: [{ url: "https://api.avax-test.network/ext/C/rpc" }]
    },
    Testdata: {},
    DEVICE_ID: 'E5879478-BAC2-4F61-9666-ED10FE1CFF11',
    DEVICE_TOKEN: "d86fLH6M89Q:APA91bGIlqIBpUczDapIP0lIPYXuBS996k8K15PV6jbNTWO53lLZontF0b8gd2NWrdpg5A-imdVd_rOcGmvH-fkMaLuXFHJA3ksdRioMUg_pTObKvbCBWUN-n45oR4SVsbX30-h07P98",
    loadTestBed(name) {
        if (!name) { name = (process.env.TESTBED) ? process.env.TESTBED : this.config.testbed }
        try {
            logger.info(`Loading Testbed: ${name}`)
            this.Testbed = require(`./environments/testbed/${name}.json`)
        } catch (error) {
            throw `Testbed "${name}" not found, HALT: ${error}`
        }
    },
    loadTestData(name) {
        if (!name) { name = (process.env.TESTDATA) ? process.env.TESTDATA : this.config.testdata }
        try {
            logger.info(`Loading Testdata: ${name}`)
            this.Testdata = require(`./environments/testdata/${name}.json`)
        } catch (error) {
            throw `Testdata "${name}" not found, HALT: ${error}`
        }
    }
}

var DEVICE_ID = 'E5879478-BAC2-4F61-9666-ED10FE1CFF11'
var DEVICE_TOKEN = "d86fLH6M89Q:APA91bGIlqIBpUczDapIP0lIPYXuBS996k8K15PV6jbNTWO53lLZontF0b8gd2NWrdpg5A-imdVd_rOcGmvH-fkMaLuXFHJA3ksdRioMUg_pTObKvbCBWUN-n45oR4SVsbX30-h07P98"

function loadTestBed(name) {
    if (!name) { name = (process.env.TESTBED) ? process.env.TESTBED : config.testbed }
    try {
        logger.info(`Loading Testbed: ${name}`)
        ENV.Testbed = require(`./environments/testbed/${name}.json`)
    } catch (error) {
        throw `Testbed "${name}" not found, HALT: ${error}`
    }
}

function loadTestData(name) {
    if (!name) { name = (process.env.TESTDATA) ? process.env.TESTDATA : config.testdata }
    try {
        logger.info(`Loading Testdata: ${name}`)
        ENV.Testdata = require(`./environments/testdata/${name}.json`)
    } catch (error) {
        throw `Testdata "${name}" not found, HALT: ${error}`
    }
}
ENV.loadTestBed()
ENV.loadTestData()
module.exports = { ENV }