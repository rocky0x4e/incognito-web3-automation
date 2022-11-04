const Web3 = require('web3')
let fs = require('fs');
let Tx = require('ethereumjs-tx').Transaction;
let Common = require('ethereumjs-common').default;

(async()=> {
    let web3 = await new Web3(new Web3.providers.HttpProvider("https://rpc.testnet.fantom.network"))
    const extPrivateKey = '0xa5ae26c7154410df235bc8669ffd27c0fc9d3068c21e469a4cc68165c68cd5cb'
    let privateKey = await Buffer.from(extPrivateKey.slice(2), 'hex')
    let count = await web3.eth.getTransactionCount("0xcE40cE511A5D084017DBee7e3fF3e455ea32D85c")

    let chainBSCTestnet = await Common.forCustomChain(
        'goerli',
        {
            'name' : 'fantom testnet',
            'networkId' : 4002,
            'chainId' : 4002
        },
        'petersburg'
    )

    let rawTransaction = {
        "gasPrice": web3.utils.toHex(web3.utils.toWei('50', 'gwei')),
        "gasLimit": web3.utils.toHex(21000),
        "to": "0xeA63F7cB43869207dF2dC77F63e8fbddf813267a",
        "value": web3.utils.toHex(123456),
        "nonce": web3.utils.toHex(count)
    }

    let transaction = new Tx(rawTransaction, { common : chainBSCTestnet })
    transaction.sign(privateKey)

    let result = await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
    console.log(result)
})()



// (
//     'goerli',
//     {
//         'name' : 'matic-mumbai',
//         'networkId' : 80001,
//         'chainId' : 80001
//     },
//     'petersburg'
// )