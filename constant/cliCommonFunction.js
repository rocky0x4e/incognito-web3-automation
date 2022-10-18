const api = require('./api');
const fs = require('fs')
const config = require('./config')
const { execSync } = require('child_process');
const common = require('./commonFunction');


const getPath = async() => {
    let path = '/Users/autonomous/Desktop/workspace/nodejs/incognito-cli-main/incognito-cli -c 1 -d 1 '
    if (global.ENV == 'testnet2') {
        path += '--net testnet '
    } else {
        // path += '--host https://mainnet.incognito.org/fullnode '
        path
    }
    return path
}

const loadBalance = async(PRIVATE_KEY) => {

    try {
        let path = await getPath()
        let execString = path + `account balanceall --privateKey ${PRIVATE_KEY}`
            // console.log({ execString });

        const output = execSync(execString, { encoding: 'utf-8' });

        let balanceString = output.substring(output.indexOf('{'))
        let balance = JSON.parse(balanceString)
        return balance
    } catch (error) {
        console.log({ error });
        if ((error + "").includes("unexpected end of JSON input") ||
            (error + "").includes("Request Entity Too Large")) {
            //remove
            let otaKey = (await keyInfo(PRIVATE_KEY)).OTAPrivateKey

            let path1 = __dirname + "/run/job/.cache/custom/" + otaKey
            await common.removeFile(path1)

            let path2 = __dirname + "/run/job/.cache/mainnet/" + otaKey
            await common.removeFile(path2)

            let path3 = __dirname + "/run/job/.cache/testnet/" + otaKey
            await common.removeFile(path3)

            //retry
            await loadBalance(PRIVATE_KEY)
        }
    }
    return null
}



const send = async(PRIVATE_KEY, ADDRESS, AMOUNT, TOKEN_ID) => {
    let path = await getPath()
    let execString = path + `send --privateKey ${PRIVATE_KEY} --address ${ADDRESS} --amount ${AMOUNT} --tokenID ${TOKEN_ID}`
        // console.log({ execString });

    const output = execSync(execString, { encoding: 'utf-8' });
    // console.log({ output });

    let tx = (JSON.parse(output.substring(output.indexOf('{')))).TxHash
    tx = tx.replace('\n', '')
    return tx
}

const addOrder = async(PRIVATE_KEY, PAIR_ID, NFT_ID, SELL_TOKEN_ID, SELLING_AMOUNT, MIN_ACCEPT_AMOUNT) => {
    let path = await getPath()
    let execString = path + `pdeaction addorder --privateKey ${PRIVATE_KEY} --pairID ${PAIR_ID} --nftID ${NFT_ID} --sellTokenID ${SELL_TOKEN_ID} --sellingAmount ${SELLING_AMOUNT} --minAcceptAmount ${MIN_ACCEPT_AMOUNT}`
        // console.log({ execString });

    const output = execSync(execString, { encoding: 'utf-8' });
    // console.log('output : ' + output);

    let tx = (JSON.parse(output.substring(output.indexOf('{')))).TxHash
    tx = tx.replace('\n', '')
    return tx
}

const trade = async(PRIVATE_KEY, SELL_TOKEN_ID, BUY_TOKEN_ID, SELLING_AMOUNT, TRADING_FEE, MIN_ACCEPT_AMOUNT, TRADING_PATH, PRV_FEE) => {
    let path = await getPath()
    let execString = path + `pdeaction trade --privateKey ${PRIVATE_KEY} --sellTokenID ${SELL_TOKEN_ID} --buyTokenID ${BUY_TOKEN_ID} --sellingAmount ${SELLING_AMOUNT} --tradingFee ${TRADING_FEE} --minAcceptAmount ${MIN_ACCEPT_AMOUNT} --tradingPath ${TRADING_PATH} --prvFee ${PRV_FEE}`
        // console.log({ execString });

    const output = execSync(execString, { encoding: 'utf-8' });
    //console.log('output : ' + output);

    let tx = (JSON.parse(output.substring(output.indexOf('{')))).TxHash
    tx = tx.replace('\n', '')
    return tx
}

const withdrawLpFee = async(PRIVATE_KEY, PAIR_ID, NFT_ID) => {
    let path = await getPath()
    let execString = path + `pdeaction withdrawlpfee --privateKey ${PRIVATE_KEY} --pairID ${PAIR_ID} --nftID ${NFT_ID}`
        // console.log({ execString });

    const output = execSync(execString, { encoding: 'utf-8' });
    // console.log({ output });

    let tx = (JSON.parse(output.substring(output.indexOf('{')))).TxHash
    tx = tx.replace('\n', '')
    return tx
}

const keyInfo = async(PRIVATE_KEY) => {
    let path = await getPath()
    let execString = path + `account keyinfo --privateKey ${PRIVATE_KEY}`
        // console.log({ execString });

    const output = execSync(execString, { encoding: 'utf-8' });
    return JSON.parse(output)

    //PrivateKey
    //PublicKey
    //PaymentAddress
    //OTAPrivateKey
    //MiningKey
    //MiningPublicKey
    //ValidatorPublicKey
    //ShardID

}



const consolidate = async(PRIVATE_KEY, TOKEN_ID) => {
    let path = await getPath()
    let execString = path + `account consolidate --privateKey ${PRIVATE_KEY} --tokenID ${TOKEN_ID}`
        // console.log({ execString });

    const output = execSync(execString, { encoding: 'utf-8' });
    // console.log('output : ' + output);

    let TxList = (JSON.parse(output.substring(output.indexOf('{')))).TxList
    return TxList
}

const printUTXO = async(PRIVATE_KEY, TOKEN_ID) => {
    let path = await getPath()
    let execString = path + `account utxo --privateKey ${PRIVATE_KEY} --tokenID ${TOKEN_ID}`
        // console.log({ execString });

    const output = execSync(execString, { encoding: 'utf-8' });
    // console.log('output : ' + output);

    return output
}

const withrawOrder = async(PRIVATE_KEY, ORDER_ID, PAIR_ID, NFT_ID, TOKEN_ID_1) => {
    let path = await getPath()
    let execString = path + `pdeaction withdraworder --privateKey ${PRIVATE_KEY} --orderID ${ORDER_ID} --pairID ${PAIR_ID} --nftID ${NFT_ID} --tokenID1 ${TOKEN_ID_1}`
        // console.log({ execString });

    const output = execSync(execString, { encoding: 'utf-8' });
    // console.log('output : ' + output);

    let tx = (JSON.parse(output.substring(output.indexOf('{')))).TxHash
    tx = tx.replace('\n', '')
    return tx
}

const stake = async(PRIVATE_KEY, MINING_KEY, CANDIDATE_ADDRESS, REWARD_ADDRESS) => {
    let path = await getPath()
    let execString = path + `stake --privateKey ${PRIVATE_KEY} --miningKey ${MINING_KEY} --candidateAddress ${CANDIDATE_ADDRESS} --rewardAddress ${REWARD_ADDRESS}`
        // console.log({ execString });

    const output = execSync(execString, { encoding: 'utf-8' });
    // console.log({ output });

    let tx = (JSON.parse(output.substring(output.indexOf('{')))).TxHash
    tx = tx.replace('\n', '')
    return tx
}

const unstake = async(PRIVATE_KEY, MINING_KEY, CANDIDATE_ADDRESS) => {
    let path = await getPath()
    let execString = path + `unstake --privateKey ${PRIVATE_KEY} --miningKey ${MINING_KEY} --candidateAddress ${CANDIDATE_ADDRESS}`
        // console.log({ execString });

    const output = execSync(execString, { encoding: 'utf-8' });
    // console.log({ output });

    let tx = (JSON.parse(output.substring(output.indexOf('{')))).TxHash
    tx = tx.replace('\n', '')
    return tx
}

const genAccount = async() => {
    let path = await getPath()
    let execString = path + `  account generate`
    console.log({ execString });

    const output = execSync(execString, { encoding: 'utf-8' });
    console.log({ output });

}

module.exports = {
    loadBalance,
    send,
    addOrder,
    trade,
    withdrawLpFee,
    keyInfo,
    withrawOrder,
    consolidate,
    stake,
    unstake,
    genAccount,
    printUTXO
}