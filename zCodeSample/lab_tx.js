const { IncRpc } = require("../lib/Incognito/RPC/Rpc")

async function main() {
    let txID = "c97bab81befc2d394ecffd960d6ca93f46055f0419ead7d355cb0566639a8f3d"
    rpc = new IncRpc("https://mfc88.ddns.net/fn")

    tx = await rpc.getTxByHash(txID)
    console.log(tx.isConfirmed())
}
main()