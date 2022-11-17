global.urlFullNode
global.urlCoinService
global.urlBackend
global.urlBackendTool
global.urlFullNodeHieu

global.ENV = 'testnet2'

const setENV = async(network = 'testnet2') => {
    global.ENV = network

    if (global.ENV == 'mainnet') {
        global.urlFullNode = 'https://mainnet.incognito.org/fullnode'
        global.urlFullNodeHieu = 'http://localhost:9999'
        global.urlCoinService = 'https://api-coinservice.incognito.org'
        global.urlPubsubService = 'https://api-coinservice.incognito.org/txservice'
        global.urlBackend = 'https://api-service.incognito.org'
        global.urlBackendTool = 'http://34.123.53.141'
        global.urlWeb3 = 'https://mainnet.infura.io/v3/'
        global.urlWebService = 'https://api-webapp.incognito.org'

    } else if (global.ENV == 'testnet2') {
        global.urlFullNode = 'https://testnet.incognito.org/fullnode'
        global.urlFullNodeHieu = 'http://localhost:9999'
        global.urlCoinService = 'https://api-coinservice-staging.incognito.org'
        global.urlPubsubService = 'http://51.161.117.193:9096'
        global.urlBackend = 'https://staging-api-service.incognito.org'
        global.urlBackendTool = 'http://34.123.53.141'
        global.urlWeb3 = 'https://kovan.infura.io/v3/'
        global.urlWebService = 'https://api-webapp-staging.incognito.org'

    } else if (global.ENV == 'testnet1') {
        global.urlFullNode = 'https://testnet1.incognito.org/fullnode'
        global.urlFullNodeHieu = 'http://localhost:9999'
        global.urlCoinService = 'http://51.195.4.15:4095'
        global.urlPubsubService = 'http://51.195.4.15:4096'
        global.urlBackend = 'https://dev-api-service.incognito.org'
        global.urlBackendTool = 'http://34.123.53.141'
        global.urlWeb3 = 'https://kovan.infura.io/v3/'
        global.urlWebService = 'https://api-webapp-staging.incognito.org'

    } else if (global.ENV == 'local') {
        global.urlFullNode = 'http://139.162.55.124:8334/'
        global.urlFullNodeHieu = 'http://localhost:9999'
        global.urlCoinService = 'http://51.89.21.38:4095'
        global.urlPubsubService = 'http://51.89.21.38:5095'
        global.urlBackend = 'https://staging-api-service.incognito.org'
        global.urlBackendTool = 'http://34.123.53.141'
        global.urlWeb3 = 'https://kovan.infura.io/v3/'
        global.urlWebService = 'https://api-webapp-staging.incognito.org'
    }

    console.log("Change ENV success : " + network);
}

setENV(global.ENV)

global.apiLog = {
    url: "",
    body: "",
    token: "",
    response: ""
}

global.listAccount = [{
    name: 'pool',
    privateKey: '113djaAdbyfaxM88E5VmAA4nwcqxgqgPcDM2YdEQL4atNLBrLK4RYkMZhkAeNiPm9M2cmuhcAD5zVcYBBjwxx5HMc3HQKbuXPzfwVrUznq7i'
}, {
    name: "anon",
    privateKey: '112t8rnXL11v8knnaWfD5tp3cmFynTX4UJEHyh9dnk55nGvmGXkm4q6v4cAMCiuCxvLgHqC9sHEiAbN8BLmghKrSniLPqCURVmNYAZNDysmt',
    address: ''
}, {
    name: 15,
    privateKey: '112t8rnXdAqwz4XVnLqfcopFuQbof6n141BPKY1uHfwmyir324SNod9sWSFNXDBSNKXp26SXPhNdVFNyeeqiCs6Tc8yrcsVPaBWrk5auTrNP',
    address: '12sveuNGdToMM98xz5Q8EKbkAtNoi6qsFdA4yei2wBe73X3Fwt5qDY6PHGvwxLVqDT8MMmGy7yuU4GzeJ6mCc7MJNYepC54jaWKxLW2kyWPhzQUuFm4FnK4QDr9fuj4cpvXqkm5PB9XXwXUyUniy'
}, {
    name: 16,
    privateKey: '112t8rnbCCek7nrtAgijV9YXpdxoDKUkewcTXJzvBrBDRUkhnsYakV9GycjqGUH8JyZqDFzK4Y8QCNZo17PK5ewop8WogZgNY5BTRarZYJLn',
    address: '12stAkYPNg1XuF3D47BvQLdEJjiHAd1qrSL2cUPEptQLhrrr1oZxAJmTQKL2iVyWsAk7JsMag22EGQRcJamedV1L1uS1keoiLom4jLu3F7B6RRFjMYQNuQ8DnL1Zo3N7s7bdU5jU4Bf1UwS7GCXe'
}, {
    name: 2,
    privateKey: '112t8rnY86q7sNHHZo9XEJMWgVds7kM913hc6pxqVrqzSA7LdMVZX6vgttLzGqNeHAjPofB5wHfNeKBGs6NZF7ZPfE5cge8ZC6TgtJPbuLru',
    otaKey: "14y9hoChwabp12Vcd6kcY6of78GYKDc4bTR72vfRieZwtpoEeXG8gimAi26hSSpTAVPL7gr8aye5PyXk59HXLtuhZsvPa5MoyRsiorv"
}, {
    name: 3,
    privateKey: '112t8rnaoYv9FppLCA7u84ay2K6ybXcCwykzCLoLT1bD9jXiSpbh8DpTKuaJD8t9Myvk2yR1hHxAu7Ac9gmox1NpKqX5ooTefprXjE1s1nd3',
    otaKey: '14y4Ef2taiMZLYGhkGTzoUxsfrKoE95xivbYXQVtzWmr2dxEBkteygrf63bTVZjvarP1X2D66fDzV61F4xjAar6vuD1KpHkymiLW48s'

}]

const getAccount = async(expectedName) => {
    let account = listAccount.find(item => item.name == expectedName)
    return account
}

const currencyType = {
    1: "eth",
    2: "btc",
    3: "eth",
    4: "bnb",
    5: "bnb",

    7: "bsc",
    8: "bsc",
    9: "tomo",
    10: "zil",
    11: "xmr",
    12: "neo",
    13: "dash",
    14: "ltc",
    15: "doge",
    16: "zec",
    17: "dot",

    19: "plg",
    20: "plg",
    21: "ftm",
    22: "ftm",
    23: "sol",
    24: "sol",
    25: "ut",
}

const getListContractOuchain = async() => {
    if (global.ENV == 'mainnet') {
        return {
            eth: [
                "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
                "0xB64fde8f199F073F41c132B9eC7aD5b61De0B1B7",
            ],
            bsc: [],
            plg: [],
            ftm: []
        }
    } else {
        return {
            eth: [
                "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
                "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
                "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
                "0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49",
                "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
                "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
            ],
            bsc: [
                "0x6ce8dA28E2f864420840cF74474eFf5fD80E65B8",
                "0xd66c6B4F0be8CE5b39D52E0Fd1344c389929B378",
                "0xB0B7A5E14C5b4E02d20552864E87Bd382eeF981f",
                "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
                "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
                "0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867",
                "0x58bEb159049f690e370E9aC9553d8C5E84726ca6", ,
                "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd"
            ],
            plg: [
                "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                "0xe0F0ffA1e897C566BC721353FF4C64FC8ACd77E0",
                "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
                "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa"
            ],
            ftm: [
                "0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F",
                "0x237Ed5598899e6fBdb1062D8556E28C3ECc400f8"
            ]
        }
    }
}

const getOutchainFullnode = async(network) => {
    if (global.ENV == 'mainnet') {
        switch (network) {
            case "eth":
                return "https://eth-fullnode.incognito.org"
            case "bsc":
                return "https://bsc-dataseed1.ninicoin.io"
            case "plg":
                return "https://polygon-rpc.com"
            case "ftm":
                return "https://rpcapi.fantom.network"
            default:
                return null
        }
    } else {
        switch (network) {
            case "eth":
                return "https://goerli.infura.io/v3/457211560d89429181f9aca50f1b4711"
            case "bsc":
                return "https://data-seed-prebsc-1-s1.binance.org:8545"
            case "plg":
                return "https://rpc-mumbai.maticvigil.com"
            case "ftm":
                return "https://rpc.testnet.fantom.network"
            default:
                return null
        }
    }
}

module.exports = {
    getAccount,
    setENV,
    currencyType,
    getListContractOuchain,
    getOutchainFullnode
}