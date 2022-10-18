const { IncRpc } = require("../lib/Incognito/RPC/Rpc");

async function main() {
    rpc = new IncRpc("http://51.83.36.184:9334")
    bbsd = await rpc.getBeaconBestStateDetail()
    console.log("Expect no error", bbsd.expectNoError())
}

main()