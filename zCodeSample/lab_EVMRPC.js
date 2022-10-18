const { EvmRPC } = require("../lib/EVM/Rpc");
const { sleep } = require("../lib/Utils/Timer")
const assert = require('assert');

async function main() {
    rpc = new EvmRPC("https://mainnet.infura.io/v3/20560320d63146d1bfc604a0594da2bc")
    blkNum1 = await rpc.getBlockNumber()
    console.log(blkNum1)
    await sleep(1)
    blkNum2 = await rpc.getBlockNumber()
    console.log(blkNum2)
    assert(blkNum1 < blkNum2, "ERROR: no new block was created")
}

main()