const { TokenId } = require('./Constants')
const { BaseCli } = require('../Base/BaseCli')
const os = require("os")

const bin = {
    "linux": "bin/incognito-cli-linux",
    "darwin": "bin/incognito-cli-mac",
    "window": "bin/incognito-cli-win",
}[os.platform()]

class IncCli extends BaseCli {

    constructor(url = null, args = "") {
        super(args)
        if (url == null) {
            this.settings = `${bin} --net testnet --cache 1 ${args} `
        } else {
            this.settings = `${bin} --net testnet --cache 1 --host ${url} ${args}`
        }
    }

    getKeyInfo(privateKey) {
        return JSON.parse(this.run(`account keyinfo --privateKey ${privateKey}`))
    }

    genAccount(mnemonic = null, numAccount = 1) {
        if (mnemonic == null) {
            return JSON.parse(this.run(`account gen --numAccounts ${numAccount}`))
        }
        return JSON.parse(this.run(`account --mnemonic "${mnemonic}" --numAccounts ${numAccount}`))
    }

    getBalanceAll(privateKey) {
        var output = this.run(`account balanceall --privateKey ${privateKey}`)
        return JSON.parse(output.substring(output.indexOf('{')))
    }

    getBalance(privateKey, token = TokenId.PRV) {
        var output = this.run(`account balance --privateKey ${privateKey} --tokenID ${token}`)
        return JSON.parse(output.substring(output.indexOf('{'))).Balance
    }

    send(privateKeySender, addressReceiver, amount, tokenId) {
        var output = this.run(`send --privateKey ${privateKeySender} \
            --address ${addressReceiver} --amount ${amount} --tokenID ${tokenId}`)
        let tx = (JSON.parse(output.substring(output.indexOf('{')))).TxHash
        tx = tx.replace('\n', '')
        return tx
    }

    addOrder(privateK, pairID, nftId, sellToken, sellAmount, minAcceptAmount) {
        const output = this.run(`pdeaction addorder --privateKey ${privateK} --pairID ${pairID} --nftID ${nftId}\
            --sellTokenID ${sellToken} --sellingAmount ${sellAmount} --minAcceptAmount ${minAcceptAmount}`)
        let tx = (JSON.parse(output.substring(output.indexOf('{')))).TxHash
        tx = tx.replace('\n', '')
        return tx
    }

    trade(privateK, selToken, buyToken, sellAmount, tradingFee, minAcceptAmount, tradingPath, prvFee) {
        const output = this.run(`pdeaction trade --privateKey ${privateK} --sellTokenID ${selToken}\
            --buyTokenID ${buyToken} --sellingAmount ${sellAmount} --tradingFee ${tradingFee}\
            --minAcceptAmount ${minAcceptAmount} --tradingPath ${tradingPath} --prvFee ${prvFee}`)
        let tx = (JSON.parse(output.substring(output.indexOf('{')))).TxHash
        tx = tx.replace('\n', '')
        return tx
    }

    withdrawLpFee(privateK, pairId, nftId) {
        const output = this.run(`pdeaction withdrawlpfee --privateKey ${privateK} --pairID ${pairId} --nftID ${nftId}`)
        let tx = (JSON.parse(output.substring(output.indexOf('{')))).TxHash
        tx = tx.replace('\n', '')
        return tx
    }

    consolidate(privateK, tokenId) {
        const output = this.run(`account consolidate --privateKey ${privateK} --tokenID ${tokenId}`)
        let TxList = (JSON.parse(output.substring(output.indexOf('{')))).TxList
        return TxList
    }

    printUTXO(privateK, tokenId) {
        const output = this.run(`account utxo --privateKey ${privateK} --tokenID ${tokenId}`);
        return output
    }

    withrawOrder(privateK, orderId, pairId, nftId, tokenId) {
        const output = this.run(`pdeaction withdraworder --privateKey ${privateK} --orderID ${orderId}\
            --pairID ${pairId} --nftID ${nftId} --tokenID1 ${tokenId}`);
        let tx = (JSON.parse(output.substring(output.indexOf('{')))).TxHash
        tx = tx.replace('\n', '')
        return tx
    }

    stake(privateKey, miningK, candidateAddr, rewardAddr) {
        const output = this.run(`stake --privateKey ${privateKey} --miningKey ${miningK}\
            --candidateAddress ${candidateAddr} --rewardAddress ${rewardAddr}`);
        let tx = (JSON.parse(output.substring(output.indexOf('{')))).TxHash
        tx = tx.replace('\n', '')
        return tx
    }

    unstake(privateK, miningK, candidateAddr) {
        const output = this.run(`unstake --privateKey ${privateK} --miningKey ${miningK}\
            --candidateAddress ${candidateAddr}`);
        let tx = (JSON.parse(output.substring(output.indexOf('{')))).TxHash
        tx = tx.replace('\n', '')
        return tx
    }
}

module.exports = { IncCli };
