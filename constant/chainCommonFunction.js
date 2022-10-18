const api = require('./api');
const fs = require('fs')
const config = require('./config')
const common = require('./commonFunction');


const submitKey = async(privateKey) => {
    let body = {
        "jsonrpc": "1.0",
        "method": "submitkey",
        "params": [
            privateKey
        ],
        "id": 1
    }

    let response = await api.post(global.urlFullNode, body)
    return Result = response.Result
}

const initToken = async(privateKey, tokenName, tokenSymbol, amount) => {
    let body = {
        "jsonrpc": "1.0",
        "id": 1,
        "method": "createandsendtokeninittransaction",
        "params": [{
            "PrivateKey": privateKey,
            "TokenName": tokenName,
            "TokenSymbol": tokenSymbol,
            "Amount": amount
        }]
    }

    let response = await api.post(global.urlFullNode, body)
    if (response && response.Result && response.Result.TxID) {
        return response.Result.TxID
    }
}

const sendPRV = async(privateKey, address, amount) => {
    let body = `{
        "id": 1,
        "jsonrpc": "1.0",
        "method": "createandsendtransaction",
        "params": [
            "${privateKey}",
            {
                "${address}": "${amount}"
            },
            5,
            0
        ]
    }`


    let response = await api.post(global.urlFullNode, JSON.parse(body))

    // console.log({ body });
    // console.log({ response });
    if (response && response.Result && response.Result.TxID) {
        return response.Result.TxID
    }
    return null
}

const convertV1ToV2 = async(privateKey) => {
    let body = `{
        "id": 1,
        "jsonrpc": "1.0",
        "method": "createconvertcoinver1tover2transaction",
        "params": [
            "${privateKey}",
            -1
        ]
    }`


    let response = await api.post(global.urlFullNode, JSON.parse(body))

    // console.log({ response });
    if (response && response.Result && response.Result.TxID) {
        return response.Result.TxID
    }
    return null
}

const mintNFT = async(privateKey) => {
    let body = {
        "jsonrpc": "1.0",
        "method": "pdexv3_txMintNft",
        "params": [
            privateKey,
            {}, -1,
            1,
            {}
        ],
        "id": 1
    }

    let response = await api.post(global.urlFullNode, body)
        // console.log(JSON.stringify(body));
        // console.log({ response });
    if (response && response.Result && response.Result.TxID) {
        return response.Result.TxID
    }
    return null
}

const sendToken = async(privateKey, tokenID, address, amount) => {
    let body = `{
        "id": 1,
        "jsonrpc": "1.0",
        "method": "createandsendprivacycustomtokentransaction",
        "params": [
            "${privateKey}",
            null,
            -1,
            1,
            {
                "Privacy": true,
                "TokenID": "${tokenID}",
                "TokenName": "",
                "TokenSymbol": "",
                "TokenTxType": 1,
                "TokenAmount": 0,
                "TokenReceivers": {
                    "${address}": ${amount}
                },
                "TokenFee": 0
            },
            "",
            0
        ]
    }`


    let response = await api.post(global.urlFullNode, JSON.parse(body))

    console.log({ body });
    console.log({ response });

    if (response && response.Result && response.Result.TxID) {
        return response.Result.TxID
    }
    return null
}

const getBeaconHeight = async() => {
    let body = {
        "jsonrpc": "1.0",
        "Params": [],
        "Method": "getblockchaininfo",
        "id": 1
    }

    let response = await api.post(global.urlFullNode, body)
    if (response && response.Result && response.Result.BestBlocks) {
        let height = response.Result.BestBlocks[-1].Height
        return height
    }
    return null
}

const waitForTxInBlock = async(hash) => {

    if (!hash) {
        return false
    }
    let body = {
        "jsonrpc": "1.0",
        "method": "gettransactionbyhash",
        "params": [hash],
        "id": 1
    }

    // console.log({ body });

    let isInBlock = false

    while (!isInBlock) {
        let response = await api.post(global.urlFullNode, body)

        if (response && response.Result && response.Result.IsInBlock) {
            isInBlock = response.Result.IsInBlock
        }

        console.log('isInBlock : ' + isInBlock);

        if (isInBlock) {
            break
        }
        if (global.ENV == 'mainnet') {
            await common.sleep(20000)
        } else {
            await common.sleep(1000)
        }
    }
}

const isTxInBlock = async(hash) => {

    if (!hash) {
        return false
    }
    let body = {
        "jsonrpc": "1.0",
        "method": "gettransactionbyhash",
        "params": [hash],
        "id": 1
    }


    if (response && response.Result && response.Result.IsInBlock) {
        return response.Result.IsInBlock
    }
}

const addLiquidity = async(privateKey, tokenID, amount, pairHash, amplifier, NFTID) => {
    let body = {
        "id": 1,
        "jsonrpc": "1.0",
        "method": "pdexv3_txAddLiquidity",
        "params": [
            privateKey,
            {},
            1,
            1,
            {
                "PoolPairID": "",
                "TokenID": tokenID,
                "ContributedAmount": amount,
                "PairHash": pairHash,
                "Amplifier": amplifier,
                "NftID": NFTID
            }
        ]
    }

    let response = await api.post(global.urlFullNode, body)

    // console.log("body : " + JSON.stringify(body));
    // console.log({ response });

    if (response && response.Result && response.Result.TxID) {
        return response.Result.TxID
    }
    return null
}



module.exports = {
    submitKey,
    sendPRV,
    sendToken,
    initToken,
    waitForTxInBlock,
    addLiquidity,
    mintNFT,
    addLiquidity,
    getBeaconHeight,
    convertV1ToV2,
    isTxInBlock
}