const { IncAccount, IncAccountGroup } = require("../lib/Incognito/Account")
const { IncNode } = require("../lib/Incognito/IncNode")


node = new IncNode("http://51.83.36.184:9334")
sender = new IncAccount("112t8rnXVMJJZzfF1naXvfE9nkTKwUwFWFeh8cfEyViG1vpA8A9khJk3mhyB1hDuJ4RbreDTsZpgJK4YcSxdEpXJKMEd8Vmp5UqKWwBcYzxv").attachTo(node)
receiver = new IncAccount("112t8rnXS1xtEyykpARqwstHb7avCiLf9fegErxsz5mYbkBE1oaiPvstPpoR3MQQ9RdKtvV932VtQe3P92NnkWax6Pj6bpERUYfySz89shvR").attachTo(node)
accounts = new IncAccountGroup()
accounts.genAccounts({ numAccount: 7 })
accounts.attachTo(node)

// sender.send(receiver, 10000)

async function check() {
    res = await node.rpc.getTxByHash("71677458e619d7607cea3220a7792465f1800b60cfc75437ec40d329042db817")
    console.log(JSON.stringify(res.data, null, 3))
}
async function main() {
    console.log("Single account: ", sender)
    console.log("Account groups:")
    for (acc of accounts.accountList) {
        console.log(acc.otaPrivateK)
    }

}
// check()
main()
