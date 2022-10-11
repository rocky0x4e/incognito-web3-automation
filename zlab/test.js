const { IncRpc } = require("../RPC/IncRPC/StateRpc")



async function main() {

    rpc = new IncRpc("https://testnet.incognito.org/fullnode")

    res = await rpc.get_beacon_best_state()
    // console.log(JSON.stringify(res.data["RewardMinted"], null, 3))
    console.log("R: ", res.get_data())
    res.expect_no_error()
    return ("done main")
}
main()
    // .then(function (result) {
    //     console.log("then:", result)
    // })
    // .catch(console.log)