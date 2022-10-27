const api = require('./api');
const fs = require('fs')
const config = require('./config')
const { table } = require('table');

let ShardPendingValidatorList;
let ShardCommitteeList;
let CandidateShardWaitingForCurrentRandom;
let CandidateBeaconWaitingForCurrentRandom;
let CandidateShardWaitingForNextRandom;
let CandidateBeaconWaitingForNextRandom;
let ListReward;

const getReward = async(publicKey) => {
    let amount = ListReward[publicKey] && ListReward[publicKey]['0000000000000000000000000000000000000000000000000000000000000004']
    let parseAmount;
    if (amount != undefined) {
        parseAmount = parseFloat(amount) / (1000000000)
    } else {
        parseAmount = 0
    }
    return parseAmount
}

const readFile = async(path) => {
    try {
        const jsonString = fs.readFileSync(path);
        const result = JSON.parse(jsonString);
        return result
    } catch (err) {
        console.log(err);
        return;
    }
}

const writeFile = async(path, json) => {
    const jsonString = JSON.stringify(json)
    fs.writeFileSync(path, jsonString)

}

const callAPI = async(url) => {
    //body
    let body = {
        jsonrpc: "1.0",
        method: "getbeaconbeststatedetail",
        params: [],
        id: 1
    }

    //get status
    let response = await api.post(url, body)
    ShardPendingValidatorList = response.Result.ShardPendingValidator
    ShardCommitteeList = response.Result.ShardCommittee
    CandidateShardWaitingForCurrentRandom = response.Result.CandidateShardWaitingForCurrentRandom
    CandidateBeaconWaitingForCurrentRandom = response.Result.CandidateBeaconWaitingForCurrentRandom
    CandidateShardWaitingForNextRandom = response.Result.CandidateShardWaitingForNextRandom
    CandidateBeaconWaitingForNextRandom = response.Result.CandidateBeaconWaitingForNextRandom

    //reward
    //body
    body = {
        jsonrpc: "1.0",
        method: "listrewardamount",
        params: [],
        id: 1
    }

    //get reward
    response = await api.post(url, body)

    ListReward = response.Result
}

const checkStatus = async(publicKey) => {

    //console.log({ShardPendingValidatorList})

    let status = '';
    //check ShardPendingValidator
    if (status == '') {
        for (let index = 0; index < 8; index++) {
            let shard = ShardPendingValidatorList[index]

            for (const item of shard) {
                if (item.IncPubKey == publicKey) {
                    status = 'ShardPendingValidator'
                    break;
                }
            }
        }
    }

    //check ShardCommittee
    if (status == '') {
        for (let index = 0; index < 8; index++) {
            let shard = ShardCommitteeList[index]

            for (const item of shard) {
                if (item.IncPubKey == publicKey) {
                    status = 'ShardCommittee'
                    break;
                }
            }
        }
    }

    //check CandidateShardWaitingForCurrentRandom
    if (status == '') {
        for (const item of CandidateShardWaitingForCurrentRandom) {
            if (item.IncPubKey == publicKey) {
                status = 'CandidateShardWaitingForCurrentRandom'
                break;
            }
        }
    }

    //check CandidateBeaconWaitingForCurrentRandom
    if (status == '') {
        for (const item of CandidateBeaconWaitingForCurrentRandom) {
            if (item.IncPubKey == publicKey) {
                status = 'CandidateBeaconWaitingForCurrentRandom'
                break;
            }
        }
    }

    //check CandidateShardWaitingForNextRandom
    if (status == '') {
        for (const item of CandidateShardWaitingForNextRandom) {
            if (item.IncPubKey == publicKey) {
                status = 'CandidateShardWaitingForNextRandom'
                break;
            }
        }
    }

    //check CandidateBeaconWaitingForNextRandom
    if (status == '') {
        for (const item of CandidateBeaconWaitingForNextRandom) {
            if (item.IncPubKey == publicKey) {
                status = 'CandidateBeaconWaitingForNextRandom'
                break;
            }
        }
    }

    //ShardCommittee
    if (status == '') {
        status = 'Not Found'
    }

    return status
}

const getbalancebyprivatekey = async(url, privateKey) => {
    //body
    let body = {
        id: 1,
        jsonrpc: "1.0",
        method: "getbalancebyprivatekey",
        params: [
            privateKey
        ]
    }

    //get status
    let response = await api.post(url, body)
    let balance = await response.Result
    return balance / 1e9
}

const getOtaKey = async(privateKey) => {

    //url
    url = global.urlBackendTool + `/wallet-info?privateKey=${privateKey}`

    //get status
    let response = await api.get(url)

    if (response && response.OtaKey) {
        let otaKey = await response.OtaKey
        return otaKey
    }
    return null
}

const pDexV3Trade = async(pool, x_trade, y_trade) => {

    if (x_trade != 0) {
        let k_vitrual = pool.Token0VirtualAmount * pool.Token1VirtualAmount
        y_trade = pool.Token1VirtualAmount - (k_vitrual / (pool.Token0VirtualAmount + x_trade))

        pool.Token0RealAmount = pool.Token0RealAmount + x_trade
        pool.Token1RealAmount = pool.Token1RealAmount - y_trade
        pool.Token0VirtualAmount = pool.Token0VirtualAmount + x_trade
        pool.Token1VirtualAmount = pool.Token1VirtualAmount - y_trade
        console.log({ x_trade });
        console.log({ y_trade });
        return pool
    }

    if (y_trade != 0) {
        let k_vitrual = pool.Token0VirtualAmount * pool.Token1VirtualAmount
        x_trade = pool.Token0VirtualAmount - (k_vitrual / (pool.Token1VirtualAmount + y_trade))

        pool.Token0RealAmount = pool.Token0RealAmount - x_trade
        pool.Token1RealAmount = pool.Token1RealAmount + y_trade
        pool.Token0VirtualAmount = pool.Token0VirtualAmount - x_trade
        pool.Token1VirtualAmount = pool.Token1VirtualAmount + y_trade
        console.log({ x_trade });
        console.log({ y_trade });
        return pool
    }
}

const pDexV3AddLiquidity = async(pool, x_add, y_add) => {

    if (x_add != 0) {
        let b = Math.abs(x_add / pool.Token0RealAmount)
        y_add = b * pool.Token1RealAmount
        if (x_add < 0) {
            y_add = b * pool.Token1RealAmount * -1
        }

        console.log((pool.Amplifier / 10000 * pool.Token0RealAmountInit) + (pool.Token0RealAmount - pool.Token0RealAmountInit));
        console.log((b + 1));

        pool.Token0VirtualAmount = (b + 1) * ((pool.Amplifier / 10000 * pool.Token0RealAmountInit) + (pool.Token0RealAmount - pool.Token0RealAmountInit))
        pool.Token1VirtualAmount = (b + 1) * ((pool.Amplifier / 10000 * pool.Token1RealAmountInit) + (pool.Token1RealAmount - pool.Token1RealAmountInit))

        pool.ShareAmount = x_add * pool.ShareAmount / pool.Token0RealAmount + pool.ShareAmount

        pool.Token0RealAmount = pool.Token0RealAmount + x_add
        pool.Token1RealAmount = pool.Token1RealAmount + y_add

        console.log({ b });
        console.log({ x_add });
        console.log({ y_add });
        return pool

    }

    if (y_add != 0) {
        let b = y_add / pool.Token1RealAmount
        x_add = b * pool.Token0RealAmount

        pool.Token0VirtualAmount = (b + 1) * ((pool.Amplifier / 10000 * pool.Token0RealAmountInit) + (pool.Token0RealAmount - pool.Token0RealAmountInit))
        pool.Token1VirtualAmount = (b + 1) * ((pool.Amplifier / 10000 * pool.Token1RealAmountInit) + (pool.Token1RealAmount - pool.Token1RealAmountInit))

        pool.ShareAmount = x_add * pool.ShareAmount / pool.Token0RealAmount + pool.ShareAmount

        pool.Token0RealAmount = pool.Token0RealAmount + x_add
        pool.Token1RealAmount = pool.Token1RealAmount + y_add

        console.log({ x_add });
        console.log({ y_add });
        return pool
    }


}

const getTokenSymbol = async(url, tokenID) => {

    let resultSymbol

    //url
    urlpToken = url + '/ptoken/list'

    //get status
    let response = await api.get(urlpToken)

    if (response.Result) {
        let tokenList = response.Result
        for (const token of tokenList) {
            if (token.TokenID == tokenID) {
                resultSymbol = token.Symbol
            }
        }
    }

    if (resultSymbol) {
        return resultSymbol
    } else {
        urlpCustomToken = url + '/pcustomtoken/list'

        let response = await api.get(urlpCustomToken)

        if (response.Result) {
            let tokenList = response.Result
            for (const token of tokenList) {
                if (token.TokenID == tokenID) {
                    resultSymbol = token.Symbol
                }
            }
        }
        return resultSymbol
    }
}

const getTokenDecimal = async(url, tokenID) => {

    //url
    url = url + '/ptoken/list'

    //get status
    let response = await api.get(url)

    if (response.Result) {
        let tokenList = response.Result
        for (const token of tokenList) {
            if (token.TokenID == tokenID) {
                return token.PDecimals
            }
        }
    }
    return null
}

const getBalanceV2 = async(url, privateKey, tokenID) => {

    //url
    url = url + "/account/utxo";

    //body
    let body = {
        "privatekey": privateKey,
        "tokenid": tokenID,
        "base58": false,
        "version": 2,
        "fromcs": true
    }

    //get status
    let response = await api.post(url, body)

    if (response.Result && response.Result.Balance) {
        let balance = await response.Result.Balance
        return balance
    }
    return 0
}

const getKeyInfo = async(url, otaKey) => {

    //url
    url = url + `/getkeyinfo?key=${otaKey}&version=2`;

    //get status
    let response = await api.get(url)

    // console.log({ url });
    // console.log(JSON.stringify(response));
    if (response.Result && response.Result.coinindex) {
        let coinindex = await response.Result.coinindex
        return coinindex
    }

    return null
}

const getUtxoV2 = async(url, privateKey, tokenID) => {

    //url
    url = url + "/account/utxo";

    //body
    let body = {
        "privatekey": privateKey,
        "tokenid": tokenID,
        "base58": false,
        "version": 2
    }

    //get status
    let response = await api.post(url, body)

    if (response.Result && response.Result.Coins) {
        return response.Result.Coins.length()
    }
    return 0
}

const getOutcoinV2 = async(url, privateKey, tokenID) => {

    //url
    url = url + "/account/outcoin";

    //body
    let body = {
        "privatekey": privateKey,
        "tokenid": tokenID,
        "base58": false,
        "version": 2
    }

    //get status
    let response = await api.post(url, body)

    if (response.Result && response.Result.Coins) {
        return response.Result.Coins.length()
    }
    return 0
}

const submitCoinserviceOTA = async(url, otaKey) => {

    //url
    url = url + `/submitotakey`;

    let body = {
        "OTAKey": otaKey,
        "ShardID": 0
    }

    //get status
    let response = await api.post(url, body)
}

const submitFullnodeOTA = async(url, privateKey) => {

    //url
    url1 = url + '/account/submitota'
        // url2 = url + '/account/submitotanew'

    let body = {
        "privatekey": privateKey
    }

    //get status
    let response1 = await api.post(url1, body)
    if (response1.Result != "done") {
        console.log("response1.Result : " + response1.Result);
        throw new Error('ERROR');
    }

    // let response2 = await api.post(url2, body)
    // if (response2.Result != "done") {
    //     console.log("response2.Result : " + response2.Result);
    //     throw new Error('ERROR');
    // }
}

const getlistprivacycustomtokenbalance = async(urlChain, urlBackend, privateKey) => {
    //body
    let body = {
        id: 1,
        jsonrpc: "1.0",
        method: "getlistprivacycustomtokenbalance",
        params: [
            privateKey
        ]
    }

    let result = []
        //get status

    let response = await api.post(urlChain, body)
    let ListCustomTokenBalance = await response.Result.ListCustomTokenBalance

    for (const CustomTokenBalance of ListCustomTokenBalance) {
        let TokenID = await CustomTokenBalance.TokenID
        let tokenInfo = await getTokenInfo(urlBackend, TokenID)
        let Symbol = tokenInfo.Symbol
        let PDecimals = tokenInfo.PDecimals

        let Amount = await CustomTokenBalance.Amount

        if (Symbol)
            result.push({
                Symbol: Symbol,
                Amount: (Amount / Math.pow(10, PDecimals))
            })
    }

    return result
}



const listunspentoutputcoinsfromcache = async(urlChain, privateKey, token) => {
    //body
    let body = {
        "jsonrpc": "1.0",
        "method": "listunspentoutputcoinsfromcache",
        "params": [
            0,
            99999999, [{
                "PrivateKey": privateKey
            }],
            token
        ],
        "id": 1
    }

    let result = []
        //get status

    let response = await api.post(urlChain, body)
    if (response.Result && response.Result.Outputs && response.Result.Outputs[privateKey]) {
        return response.Result.Outputs[privateKey]
    }
}


const pDexGetlistprivacycustomtokenbalance = async(urlChain, privateKey) => {
    //body
    let body = {
        id: 1,
        jsonrpc: "1.0",
        method: "getlistprivacycustomtokenbalance",
        params: [
            privateKey
        ]
    }

    let response = await api.post(urlChain, body)
    if (response && response.Result && response.Result.ListCustomTokenBalance) {
        let ListCustomTokenBalance = await response.Result.ListCustomTokenBalance


        let listBalance = []
        for (const customTokenBalance of ListCustomTokenBalance) {
            let tokenID = await customTokenBalance.TokenID
            let name = await customTokenBalance.Name
            let symbol = await customTokenBalance.Symbol
            let balance = await customTokenBalance.Amount

            if (symbol == "") {
                symbol = tokenID
            }
            if (symbol == "0000000000000000000000000000000000000000000000000000000000000006") {
                symbol = "pDex"
            }


            listBalance.push({
                tokenID: tokenID,
                symbol: symbol,
                balance: balance
            })
        }
        return listBalance
    }
    return null
}

const pDexGetbalancebyprivatekey = async(urlChain, privateKey) => {
    //body
    let body = {
        id: 1,
        jsonrpc: "1.0",
        method: "getbalancebyprivatekey",
        params: [
            privateKey
        ]
    }

    let result = []
        //get status

    let response = await api.post(urlChain, body)
    if (response && response.Result) {
        return response.Result
    }
    return null
}

const getTokenInfo = async(url, tokenID) => {
    let result = {}
    let response = await api.get(url + "/ptoken/list")
    let listToken = await response.Result

    for (const token of listToken) {
        let TokenID = await token.TokenID
        if (tokenID == TokenID) {
            let Symbol = await token.Symbol
            let PDecimals = await token.PDecimals

            result = {
                Symbol,
                PDecimals
            }
            break
        }
    }
    return result
}

const getblockchaininfo = async(url) => {

    let array = []
    let body = {
        jsonrpc: "1.0",
        Params: [],
        Method: "getblockchaininfo",
        id: 1
    }

    let response = await api.post(url, body)
    let BestBlocks = response.Result.BestBlocks
    console.log({ BestBlocks });

    let totalShard = 8
    if (url.includes("51.161.117.88")) {
        totalShard = 2
    }

    for (let index = 0; index < totalShard; index++) {
        let Height = BestBlocks[index].Height
            //console.log("Height" , Height)
        array.push(Height)
    }


    return array
}

const retrieveblockbyheight = async(url, height, shardID) => {

    let Txs = null
    let array = []
    let body = {
        "jsonrpc": "1.0",
        "id": 1,
        "method": "retrieveblockbyheight",
        "params": [
            height,
            shardID,
            "2"
        ]
    }

    let response = await api.post(url, body)

    if (response && response.Result && response.Result[0] && response.Result[0].Txs) {
        Txs = response.Result[0].Txs
        for (const TxsItem of Txs) {
            let Hash = TxsItem.Hash
            array.push(Hash)
        }
    }
    return array
}

const pDex3EstimateLiquidityReward = async(state, totalFee, poolPairID, limitOrderContribute, AMMContribute) => {
    let response = state

    let OrderTradingRewardRatioBPS = 0
    let reward = []


    //get orderMiningRewardRatioBPS
    if (response.Result.Params.OrderTradingRewardRatioBPS && response.Result.Params.OrderTradingRewardRatioBPS[poolPairID]) {
        OrderTradingRewardRatioBPS = response.Result.Params.OrderTradingRewardRatioBPS[poolPairID]
        OrderTradingRewardRatioBPS = OrderTradingRewardRatioBPS / 10000
    } else if (response.Result.Params.DefaultOrderTradingRewardRatioBPS) {
        OrderTradingRewardRatioBPS = response.Result.Params.DefaultOrderTradingRewardRatioBPS
        OrderTradingRewardRatioBPS = OrderTradingRewardRatioBPS / 10000
    }


    //get stakingFeePercent
    let stakingFeePercent = await pDex3GetStakingPercent(state)

    let tradingProtocolFeePercent = response.Result.Params.TradingProtocolFeePercent


    // console.log({ tradingProtocolFeePercent });
    // console.log({ stakingFeePercent });

    let liquidityFeePercent = 100 - (tradingProtocolFeePercent + stakingFeePercent)

    let totalShareAmount = response.Result.PoolPairs[poolPairID].State.ShareAmount

    let totalRewardLPAndOrder = totalFee / 100 * liquidityFeePercent
    console.log({ totalRewardLPAndOrder });

    console.log({ OrderTradingRewardRatioBPS });
    if (limitOrderContribute[0] && OrderTradingRewardRatioBPS > 0 && limitOrderContribute[0].amount > 0) {
        let totalShare = AMMContribute

        for (const order of limitOrderContribute) {
            totalShare += OrderTradingRewardRatioBPS * order.amount
        }

        let rewardLP = totalRewardLPAndOrder / totalShare * AMMContribute

        //count reward for LP
        let listNFTShare = response.Result.PoolPairs[poolPairID].Shares

        for (let key of Object.keys(listNFTShare)) {
            let name = "NFT-" + key
            let rewardNFTShare = rewardLP / totalShareAmount * listNFTShare[key].Amount
            reward.push({
                name: name,
                reward: rewardNFTShare
            })
        }

        //count reward for OL
        for (const order of limitOrderContribute) {
            let name = "Order-" + order.id
            let rewardOrder = totalRewardLPAndOrder / totalShare * (order.amount * OrderTradingRewardRatioBPS)
            reward.push({
                name: name,
                reward: rewardOrder
            })
        }

    } else {
        let listNFTShare = response.Result.PoolPairs[poolPairID].Shares

        for (let key of Object.keys(listNFTShare)) {
            let name = "NFT-" + key
            let rewardNFTShare = totalRewardLPAndOrder / totalShareAmount * listNFTShare[key].Amount
            reward.push({
                name: name,
                reward: rewardNFTShare
            })
        }
    }
    return reward
}

const pDex3EstimateLiquidityRewardNoLimitOrder = async(state, totalFee, poolPairID) => {
    let response = state

    let OrderTradingRewardRatioBPS
    let reward = []

    //get stakingFeePercent
    let stakingFeePercent = await pDex3GetStakingPercent(state)

    let tradingProtocolFeePercent = response.Result.Params.TradingProtocolFeePercent

    let liquidityFeePercent = 100 - (tradingProtocolFeePercent + stakingFeePercent)

    let totalShareAmount = response.Result.PoolPairs[poolPairID].State.ShareAmount

    let totalRewardLPAndOrder = totalFee / 100 * liquidityFeePercent

    let listNFTShare = response.Result.PoolPairs[poolPairID].Shares

    for (let key of Object.keys(listNFTShare)) {
        let name = key
        let rewardNFTShare = totalRewardLPAndOrder / totalShareAmount * listNFTShare[key].Amount
        reward.push({
            name: name,
            reward: rewardNFTShare
        })
    }

    return reward
}

const pDex3EstimateProtocolReward = async(state, totalFee) => {

    let response = state
    if (response && response.Result && response.Result.Params.TradingProtocolFeePercent) {
        let tradingProtocolFeePercent = response.Result.Params.TradingProtocolFeePercent

        return reward = totalFee * tradingProtocolFeePercent / 100
    } else {
        return null
    }
}

const pDex3GetBuyAmountFromTx = async(url, tx) => {
    let beaconHeight = await getBestBeconHeight(url)

    let body = {
        "jsonrpc": "1.0",
        "method": "pdexv3_getTradeStatus",
        "params": [
            tx
        ],
        "id": 1
    }

    let response = await api.post(url, body)
    if (response && response.Result) {
        return reward = response.Result
    } else {
        return null
    }
}

const pDex3GetPoolState = async(url, poolPairID) => {
    let beaconHeight = await getBestBeconHeight(url)

    let body = {
        "id": 1,
        "jsonrpc": "1.0",
        "method": "pdexv3_getState",
        "params": [{
            "BeaconHeight": beaconHeight,
            "Filter": {
                "Key": "All",
                "Verbosity": 1,
                "ID": "1"
            }
        }]
    }

    let response = await api.post(url, body)
    if (response && response.Result && response.Result.PoolPairs[poolPairID].State) {
        let state = {
            State: response.Result.PoolPairs[poolPairID].State,
            orders: response.Result.PoolPairs[poolPairID].Orderbook.orders
        }

        return state
    }
    return null
}

const pDex3CountProtocolFee = async(url) => {
    let beaconHeight = await getBestBeconHeight(url)

    let body = {
        "id": 1,
        "jsonrpc": "1.0",
        "method": "pdexv3_getState",
        "params": [{
            "BeaconHeight": beaconHeight,
            "Filter": {
                "Key": "All",
                "Verbosity": 1,
                "ID": "1"
            }
        }]
    }

    let reward = {}

    let response = await api.post(url, body)
    if (response && response.Result && response.Result.PoolPairs) {
        let PoolPairs = await response.Result.PoolPairs
            // console.log({ PoolPairs });

        for (var key in PoolPairs) {
            if (PoolPairs.hasOwnProperty(key)) {
                let ProtocolFees = PoolPairs[key].ProtocolFees

                for (var key1 in ProtocolFees) {
                    if (ProtocolFees.hasOwnProperty(key1)) {
                        let fee = ProtocolFees[key1]

                        console.log(key1);

                        if (reward.hasOwnProperty(key1)) {
                            console.log("yes");
                            reward[key1] += fee
                        } else {
                            reward[key1] = fee
                        }
                    }
                }
            }
        }
        return reward
    }
}

const pDex3Trade = async(url, privateKey, tradePath, tokenSell, tokenBuy, sellAmount, tradingFee, feePRV) => {

    let body = {
        "jsonrpc": "1.0",
        "method": "pdexv3_txTrade",
        "params": [
            privateKey,
            {}, -1,
            1,
            {
                "TradePath": tradePath,
                "TokenToSell": tokenSell,
                "TokenToBuy": tokenBuy,
                "SellAmount": sellAmount,
                "MinAcceptableAmount": "1",
                "TradingFee": tradingFee,
                "FeeInPRV": feePRV
            }
        ],
        "id": 1
    }


    let response = await api.post(url, body)

    // console.log({ url });
    // console.log(JSON.stringify(body));
    // console.log({ response });
    if (response && response.Result && response.Result.TxID) {
        let tx = response.Result && response.Result.TxID
        return tx
    }
}

const pDex3Estimatetrade = async(url, sellToken, buyToken, sellamount) => {
    sellamount = sellamount.toFixed(0)
    let urlFull = `${url}/pdex/v3/estimatetrade?selltoken=${sellToken}&buytoken=${buyToken}&ismax=false&sellamount=${sellamount}`

    // console.log({ urlFull });
    let response = await api.get(urlFull)

    // console.log({ url });
    // console.log(JSON.stringify(body));
    // console.log({ response });

    if (response && response.Result) {
        if (response.Result.FeePRV && response.Result.FeePRV.Fee > 0) {
            let maxGet = response.Result.FeePRV.MaxGet
                // console.log({ maxGet });
            return maxGet
        } else {
            let maxGet = response.Result.FeeToken.MaxGet
                // console.log({ maxGet });
            return maxGet
        }
    }

    return null
}

const pDex3EstimatetradeGetDebug = async(url, sellToken, buyToken, sellamount) => {
    sellamount = sellamount.toFixed(0)
    let urlFull = `${url}/pdex/v3/estimatetrade?selltoken=${sellToken}&buytoken=${buyToken}&ismax=false&sellamount=${sellamount}`

    // console.log({ urlFull });
    let response = await api.get(urlFull)

    // console.log({ urlFull });
    // console.log({ response });

    if (response && response.Result) {
        if (response.Result.FeePRV && response.Result.FeePRV.Fee > 0) {
            let Debug = response.Result.FeePRV.Debug
                // console.log({ maxGet });
            return Debug
        } else {
            let Debug = response.Result.FeeToken.Debug
                // console.log({ maxGet });
            return Debug
        }
    }

    return null
}

const pDex3GetEstimatetrade = async(url, sellToken, buyToken, sellamount) => {

    sellamount = sellamount.toFixed(0)
    let urlFull = `${url}/pdex/v3/estimatetrade?selltoken=${sellToken}&buytoken=${buyToken}&ismax=false&sellamount=${sellamount}`

    // console.log({ urlFull });
    let response = await api.get(urlFull)

    // console.log({ urlFull });
    // console.log({ response });
    if (response && response.Result) {
        if (response.Result.FeePRV.Fee != 0) {
            return response.Result.FeePRV
        } else {
            return response.Result.FeeToken
        }
    }

    return null
}

const pDex3GetEstimatedLPPoolReward = async(url, BeaconHeight, PoolPairID) => {

    let body = {
        "jsonrpc": "1.0",
        "method": "pdexv3_getEstimatedLPPoolReward",
        "params": [{
            "BeaconHeight": BeaconHeight,
            "PoolPairID": PoolPairID
        }],
        "id": 1
    }

    // console.log({ url });
    // console.log(JSON.stringify(body));
    let response = await api.post(url, body)

    // console.log({ url });
    // console.log({ body });
    // console.log({ response });
    if (response && response.Result) {
        let reward = response.Result['0000000000000000000000000000000000000000000000000000000000000006']
        return reward
    }
}

const pDex3GetState = async(url) => {
    let beaconHeight = await getBestBeconHeight(url)

    let body = {
        "id": 1,
        "jsonrpc": "1.0",
        "method": "pdexv3_getState",
        "params": [{
            "BeaconHeight": beaconHeight,
            "Filter": {
                "Key": "All",
                "Verbosity": 1,
                "ID": "1"
            }
        }]
    }

    let response = await api.post(url, body)
    if (response) {
        return response
    }
    return null
}


const pDex3EstimateStakingReward = async(state, totalFee, NFTid, stakingPoolID) => {
    let response = state

    if (response && response.Result && response.Result.Params.TradingStakingPoolRewardPercent) {
        let stakingFeePercent = response.Result.Params.TradingStakingPoolRewardPercent

        let StakingPoolsShare = response.Result.Params.StakingPoolsShare
        let totalStakingPoolsShare = null

        for (key in StakingPoolsShare) {
            if (StakingPoolsShare.hasOwnProperty(key)) {
                totalStakingPoolsShare += StakingPoolsShare[key]
            }
        }

        let stakingPoolIDSharePercent = StakingPoolsShare[stakingPoolID] / totalStakingPoolsShare

        if (response && response.Result && response.Result.StakingPools[stakingPoolID].Stakers &&
            response.Result.StakingPools[stakingPoolID].Stakers[NFTid].Liquidity) {

            let totalStakingShare = response.Result.StakingPools[stakingPoolID].Liquidity

            let nftStakingShare = response.Result.StakingPools[stakingPoolID].Stakers[NFTid].Liquidity

            return reward = (totalFee * stakingFeePercent / 100) * stakingPoolIDSharePercent / totalStakingShare * nftStakingShare
        }
    }

    return null
}

const pDex3GetStakingPercent = async(state) => {

    let response = state

    if (response && response.Result && response.Result.Params.TradingStakingPoolRewardPercent) {
        let percent = response.Result.Params.TradingStakingPoolRewardPercent

        console.log({ percent });
        if (percent > 0) {
            if (response.Result.Params.StakingPoolsShare != null) {
                let stakingPools = response.Result.StakingPools
                console.log({ stakingPools });
                if (stakingPools) {
                    console.log("haha");
                    return percent
                }
            }
        }
    }
    return 0
}

const pDex3GetStakingReward = async(url, NFTid, stakingPoolID) => {
    let beaconHeight = await getBestBeconHeight(url)

    let body = {
        "jsonrpc": "1.0",
        "method": "pdexv3_getEstimatedStakingReward",
        "params": [{
            "StakingPoolID": stakingPoolID,
            "NftID": NFTid,
            "BeaconHeight": 0
        }],
        "id": 1
    }

    let response = await api.post(url, body)
    if (response && response.Result) {
        return response.Result
    } else {
        return {}
    }
}

const pDex3GetLiquidityReward = async(url, NFTid, PoolPairID) => {
    let beaconHeight = await getBestBeconHeight(url)

    let body = {
        "jsonrpc": "1.0",
        "method": "pdexv3_getEstimatedLPValue",
        "params": [{
            "PoolPairID": PoolPairID,
            "NftID": NFTid,
            "BeaconHeight": 0
        }],
        "id": 1
    }


    let response = await api.post(url, body)

    if (response && response.Result && response.Result.LPReward) {
        return response.Result.LPReward
    } else {
        return null
    }
}

const pDex3GetOrderLimitReward = async(url, NFTid, PoolPairID) => {
    let beaconHeight = await getBestBeconHeight(url)

    let body = {
        "jsonrpc": "1.0",
        "method": "pdexv3_getEstimatedLPValue",
        "params": [{
            "PoolPairID": PoolPairID,
            "NftID": NFTid,
            "BeaconHeight": 0
        }],
        "id": 1
    }


    let response = await api.post(url, body)
    if (response && response.Result && response.Result.OrderReward) {
        return response.Result.OrderReward
    } else {
        return null
    }
}

const pDex3GetProtocolReward = async(state, PoolPairID) => {
    let response = state
    if (response && response.Result && response.Result.PoolPairs && response.Result.PoolPairs[PoolPairID].ProtocolFees) {
        return response.Result.PoolPairs[PoolPairID].ProtocolFees
    } else {
        return null
    }
}

const getBestBeconHeight = async(url) => {
    let body = {
        "jsonrpc": "1.0",
        "method": "getbeaconbeststatedetail",
        "id": 1
    }

    let response = await api.post(url, body)

    if (response && response.Result && response.Result.BeaconHeight) {
        return response.Result.BeaconHeight
    } else {
        return null
    }

}

const getUTXO = async(url, PaymentAddress, ReadonlyKey) => {

    let result
    let body = {
        "jsonrpc": "1.0",
        "method": "listoutputcoins",
        "params": [
            0,
            999999, [{
                "PaymentAddress": PaymentAddress,
                "ReadonlyKey": ReadonlyKey
            }]
        ],
        "id": 1
    }

    let response = await api.post(url, body)
    if (response && response.Result && response.Result.Outputs) {
        let item1 = response.Result.Outputs[ReadonlyKey]
        result = item1.length
    }
    return result
}

const createAccount = async(url, key) => {
    let result
    let body = {
        "id": 1,
        "jsonrpc": "1.0",
        "method": "getaccountaddress",
        "params": key
    }
    let response = await api.post(url, JSON.stringify(body))
    if (response && response.Result) {
        result = response.Result
    }
    return result
}

const apiGetNodeInfo = async(url, token, nodes) => {

    let fullURL = url + "/pnode/get-node-info"
    let body = []
    for (const node of nodes) {
        if (node && node.QRCode) {
            body.push({
                QRCode: node.QRCode
            })
        } else if (node && node.publickey) {
            body.push({
                publickey: node.publickey
            })
        }
    }

    let response = await api.postWithToken(fullURL, token, body)

    if (response && response.Result) {
        return response.Result
    }
    return []
}

const apiNewTokenBackend = async(url, DeviceID, DeviceToken) => {

    let fullURL = url + "/auth/new-token"
    let body = {
        "DeviceID": DeviceID,
        "DeviceToken": DeviceToken
    }
    let response = await api.post(fullURL, body)
    if (response && response.Result && response.Result.Token) {
        return response.Result.Token
    }
    return null
}

const readNodeInfo = async(urlchain, listNode, listNodeInfo) => {

    for (let i = 0; i < listNodeInfo.length; i++) {

        let status = "Not found"
        let reward = 0

        let publicKey = null
        if (listNode[i].publickey) {
            publicKey = listNode[i].publickey
        } else {
            publicKey = await apiGetPublickeyFromPaymentAddress(urlchain, listNode[i].paymentAddress)
        }

        if (ShardPendingValidatorList && publicKey) {
            for (let index = 0; index < 2; index++) {
                let shard = ShardPendingValidatorList[index]
                for (const item of shard) {
                    if (item.IncPubKey == publicKey) {
                        status = 'PendingValidator'
                        break;
                    }
                }
            }
        }

        if (status === "Not found") {
            //check status
            if (listNodeInfo[i].IsAutoStake && listNodeInfo[i].IsInAutoStaking && listNodeInfo[i].IsInCommittee) {
                status = "Commitee        "
            } else if (listNodeInfo[i].IsAutoStake && listNodeInfo[i].IsInAutoStaking && !listNodeInfo[i].IsInCommittee) {
                status = "Ramdom          "
            } else if (!listNodeInfo[i].IsAutoStake && listNodeInfo[i].IsInAutoStaking) {
                status = "Unstaking       "
            } else if (!listNodeInfo[i].IsInAutoStaking) {
                status = "Not found       "
            }

        }

        //check reward
        if (listNodeInfo[i].Rewards) {
            reward = listNodeInfo[i].Rewards[0].Amount / 1e9
        }

        consoleLogNodeInfo(listNode[i].name, status, reward)
    }
}

const consoleLogNodeInfo = async(name, status, reward) => {
    let numberOfSpace = 14 - name.length

    for (let i = 0; i < numberOfSpace; i++) {
        name += " "
    }

    let messenge = `node : ${name} ===> ${status} ===> ${reward}`
    console.log(messenge)
}


const withdrawAllpNode = async(url, token, listNode, listNodeInfo) => {

    console.log("--------Withdraw--------");
    for (let i = 0; i < listNodeInfo.length; i++) {

        if (listNodeInfo[i] && listNodeInfo[i].QRCode && listNodeInfo[i].Rewards) {
            if (listNode[i] && listNode[i].paymentAddress) {
                let ProductID = await apiGetProductID(url,
                    token,
                    listNode[i].paymentAddress)


                if (ProductID && listNode[i].validatorKey && listNode[i].QRCode) {
                    await apiPnodeRequestWithdraw(url,
                        token,
                        listNode[i].paymentAddress,
                        ProductID,
                        listNode[i].validatorKey,
                        listNode[i].QRCode)
                }
            }
        }
    }
}


const apiGetProductID = async(url, token, paymentAddress) => {
    let fullURL = url + '/pool/request-stake?PaymentAddress=' + paymentAddress

    console.log({ fullURL });

    let response = await api.getWithToken(fullURL, token)
    console.log({ response });

    if (response && response.Result && response.Result.ProductID) {
        return response.Result.ProductID
    }
    return null
}


const apiPnodeRequestWithdraw = async(url, token, paymentAddress, productID, validatorKey, QRCode) => {
    try {
        fullURL = url + "/pool/request-withdraw"
        let body = {
            "PaymentAddress": paymentAddress,
            "ProductID": productID,
            "ValidatorKey": validatorKey,
            "QRCode": QRCode
        }

        response = await api.postWithToken(fullURL, token, body)
        if (response && response.Error && response.Error.Message) {
            console.log(`Withdraw fail with node : ${QRCode} - ${response.Error.Message}`);
        } else {
            console.log("Withdraw success with node : ", QRCode);
        }

    } catch (error) {
        console.log("Withdraw fail with node : ", QRCode);
    }
}

const apiGetPublickeyFromPaymentAddress = async(url, paymentAddress) => {
    let body = {
        "id": 1,
        "jsonrpc": "1.0",
        "method": "getpublickeyfrompaymentaddress",
        "params": [
            paymentAddress
        ]
    }

    let response = await api.post(url, body)

    if (response && response.Result && response.Result.PublicKeyInBase58Check) {
        return response.Result.PublicKeyInBase58Check
    }
    return null
}

const sendPRV = async(privateKey, address, amount) => {

    let body = `{
        "jsonrpc": "0.1",
        "method": "createandsendtransaction",
        "params": [
            "${privateKey}",
            {
                "${address}": ${amount}
            },
            100,
            1
        ],
        "id": 1
    }`

    let response = await api.post(global.urlFullNode, JSON.parse(body))

    // console.log({body});
    // console.log('response  : ' + JSON.stringify(response));

    if (response && response.Result && response.Result.TxID) {
        return response.Result.TxID
    }
    return null;

}

const sendToken = async(privateKey, tokenID, address, amount) => {

    let body = `{
        "id": 1,
        "jsonrpc": "1.0",
        "method": "createandsendprivacycustomtokentransaction",
        "params": [
            "${privateKey}",
            {},
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
            1
        ]
    }`

    let response = await api.post(global.urlFullNode, JSON.parse(body))


    if (response && response.Result && response.Result.TxID) {
        return response.Result.TxID
    }
    return null;
}

const pDexV3SendCustomToken = async(privateKey, tokenID, address, amount) => {

    let body = `{
        "id": 1,
        "jsonrpc": "1.0",
        "method": "createandsendprivacycustomtokentransaction",
        "params": [
            "${privateKey}",
            {
                "${address}": ${amount}
            },
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
        // console.log({ body });
        // console.log({ response });

    if (response && response.Result && response.Result.TxID) {
        console.log("ptoken : " + response.Result.TxID);
        return response.Result.TxID
    }
}

const pDexV3SendPRV = async(privateKey, address, amount) => {

    let body = `{
        "id": 1,
        "jsonrpc": "1.0",
        "method": "createandsendtransaction",
        "params": [
            "${privateKey}",
            {
                "${address}": ${amount}
            },
            5,
            0
        ]
    }`

    let response = await api.post(global.urlFullNode, JSON.parse(body))


    if (response && response.Result && response.Result.TxID) {
        console.log("PRV : " + response.Result.TxID);
        return response.Result.TxID
    }
}

const sendPrvV2 = async(url, privateKey, address, amount) => {

    url = url + '/tx/sendprv'

    let body = `{
        "privatekey": "${privateKey}",
        "receivers": {
            "${address}": ${amount}
        },
        "fee": 100,
        "version": 2
    }`

    let response = await api.post(url, JSON.parse(body))


    if (response && response.Result) {
        return response.Result
    }
    return null;
}


const sendTokenV2 = async(url, privateKey, tokenID, address, amount) => {

    url = url + '/tx/sendtoken'

    let body = `{
        "privatekey": "${privateKey}",
        "receivers": {
            "${address}": ${amount}
        },
        "tokenid": "${tokenID}",
        "fee": 100,
        "version": 2
    }`

    let response = await api.post(url, JSON.parse(body))


    if (response && response.Result) {
        return response.Result
    }
    return null;
}


const isTxInBlock = async(url, tx) => {
    let body = {
        "jsonrpc": "1.0",
        "method": "gettransactionbyhash",
        "params": [tx],
        "id": 1
    }

    let response = await api.post(url, body)
    if (response && response.Result && response.Result.IsInBlock) {
        return response.Result.IsInBlock
    }
    return false;
}

const getPRVBalanceByPrivateKey = async(url, privateKey) => {

    let body = {
        "id": 1,
        "jsonrpc": "1.0",
        "method": "getbalancebyprivatekey",
        "params": [
            privateKey
        ]
    }

    let response = await api.post(url, body)
    if (response && response.Result) {
        return response.Result
    }
    return null;
}

const sleep = async(ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const randomNumber = async(number) => {
    let result = 0
    while (result == 0) {
        result = Math.floor(Math.random() * number);
    }
    return result
}

const randomNumberInRange = async(numberMin, numberMax) => {
    let result = 0
    while (result == 0) {
        result = Math.floor(Math.random() * (numberMax - numberMin) + numberMin);
    }
    return result
}

const randomProperty = async(obj) => {
    const keys = Object.keys(obj);

    return keys[Math.floor(Math.random() * keys.length)];
}



const convertBlockShardToBecon = async(shard, block) => {
    let url = global.urlFullNode

    let body = {
        "jsonrpc": "1.0",
        "Params": [],
        "Method": "getblockchaininfo",
        "id": 1
    }

    let response = await api.post(url, body)

    if (response.Result.BestBlocks) {

        let bestBlocks = response.Result.BestBlocks
        let heightShard0 = bestBlocks[-1].Height
        let heightShardTarget = bestBlocks[shard].Height

        let different = heightShardTarget - heightShard0

        // console.log({ heightShard0 });
        // console.log({ heightShardTarget });
        // console.log({ different });

        return block - different
    }
}

const printTable = async(header, data) => {
    const config = {
        header: {
            alignment: 'center',
            content: header
        },
    }

    console.log(table(data, config));
}

const removeFile = async(path) => {
    try {
        fs.unlinkSync(path);

        console.log("File is deleted.");
    } catch (error) {
        if ((error + "").includes('no such file or directory')) {
            console.log("no such file or directory");
        } else {
            console.log(error);
        }
    }
}

const getCurrentTime = async() => {
    let date = new Date().toLocaleString()
    return date
}



module.exports = {
    printTable,
    checkStatus,
    getReward,
    callAPI,
    getbalancebyprivatekey,
    getlistprivacycustomtokenbalance,
    getblockchaininfo,
    retrieveblockbyheight,
    getUTXO,
    createAccount,
    apiNewTokenBackend,
    apiGetNodeInfo,
    readNodeInfo,
    withdrawAllpNode,
    sendPRV,
    isTxInBlock,
    sleep,
    getPRVBalanceByPrivateKey,
    sendToken,
    randomNumber,
    getBalanceV2,
    submitCoinserviceOTA,
    submitFullnodeOTA,
    getUtxoV2,
    getOutcoinV2,
    getKeyInfo,
    getOtaKey,
    getTokenSymbol,
    getTokenDecimal,
    sendPrvV2,
    sendTokenV2,
    readFile,
    writeFile,
    apiGetProductID,
    pDexGetlistprivacycustomtokenbalance,
    pDexGetbalancebyprivatekey,
    pDex3EstimateStakingReward,
    pDex3EstimateProtocolReward,
    pDex3EstimateLiquidityReward,
    pDexV3Trade,
    pDexV3AddLiquidity,
    pDex3Trade,
    pDex3CountProtocolFee,
    pDexV3SendCustomToken,
    pDexV3SendPRV,
    pDex3GetStakingReward,
    pDex3GetProtocolReward,
    pDex3GetLiquidityReward,
    pDex3GetEstimatedLPPoolReward,
    pDex3Estimatetrade,
    pDex3GetEstimatetrade,
    pDex3EstimatetradeGetDebug,
    convertBlockShardToBecon,
    pDex3GetOrderLimitReward,
    pDex3GetBuyAmountFromTx,
    pDex3GetPoolState,
    pDex3EstimateLiquidityRewardNoLimitOrder,
    pDex3GetState,
    listunspentoutputcoinsfromcache,
    randomProperty,
    removeFile,
    getCurrentTime

}