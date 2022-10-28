const { IncAccount, IncAccountGroup } = require("../lib/Incognito/Account/Account")
const { CoinServiceApi } = require("../lib/Incognito/CoinService/CoinServiceApi")
const { IncNode } = require("../lib/Incognito/IncNode")


let node = new IncNode()
let sender = new IncAccount("112t8rnXVMJJZzfF1naXvfE9nkTKwUwFWFeh8cfEyViG1vpA8A9khJk3mhyB1hDuJ4RbreDTsZpgJK4YcSxdEpXJKMEd8Vmp5UqKWwBcYzxv").attachTo(node)
let receiver = new IncAccount("112t8rnXS1xtEyykpARqwstHb7avCiLf9fegErxsz5mYbkBE1oaiPvstPpoR3MQQ9RdKtvV932VtQe3P92NnkWax6Pj6bpERUYfySz89shvR").attachTo(node)
let receiver2 = new IncAccount({ "PaymentAddress": '12suG5oV5KQspoUPseBAnLCmm8vBPQs3je7kbiLuBSyvhAG2dHbo3RP5zRsNoB9Y2m9fA342MyfbpoUJYNcS5zhB5pU89kUiU3YPGDCjh8Eg7Y5HdgAU33XrNQ3q77J5BwThnmcXZvyNekF6EnSr' })
// let accounts = new IncAccountGroup()
// accounts.genAccounts({ numAccount: 7 })
// accounts.attachTo(node)


async function check() {
    res = await node.rpc.getTxByHash("71677458e619d7607cea3220a7792465f1800b60cfc75437ec40d329042db817")
    console.log(JSON.stringify(res.data, null, 3))
}
async function main() {

    // let cs = new CoinServiceApi()
    // await cs.submitOtaKey(sender.otaPrivateK)

    // await sender.initSdkInstance()
    // sender.balSdk = await sender.useSdk.getBalanceAll()
    // console.log("sender bal sdk", sender.balSdk)

    // receiver.balB4 = await receiver.useSdk.getBalance()

    // console.log("receiver", receiver.balB4)

    // tx = await sender.useCli.send(receiver, 10000)
    // node.rpc.getTxByHash(tx)
    // let senderBalAfter = await sender.useCli.getBalance()
    // let receiverBalAfter = await receiver.useCli.waitBalanceChange({ from: receiverBalBefore })

    // console.log("sender", senderBalBefore, senderBalAfter)
    // console.log("receiver", receiverBalBefore, receiverBalAfter)

    var proof = await sender.useRpc.makeRawTx(receiver2, 1000000000)
    console.log(proof);
}
// check()
main()
