const { IncNode } = require("../../../lib/Incognito/IncNode");
const chai = require('chai');
const { wait } = require("../../../lib/Utils/Timer");
const { addContent } = require("../../../lib/Utils/AddingContent");
const { incFullnodes } = require("./data");

async function checkMempool(url) {
    monitorDuration = 60
    txList = null
    var incNode = new IncNode(url)
    var blocktime = await incNode.calCurrentBlockTime()
    while (monitorDuration > blocktime) {
        var mempool = await incNode.rpc.getMemPool()
        var mempoolTxList = mempool.ListTxs
        if (mempoolTxList != null) {
            addContent(`Mempool before vs after ${txList} >< ${mempoolTxList}`)
            chai.assert(mempoolTxList != txList)
        } else {
            addContent("Mempool is currently empty")
        }
        txList = mempoolTxList
        await wait(blocktime)
        monitorDuration -= blocktime
    }
}

describe("Check incognito mempool", () => {
    incFullnodes.forEach(url => {
        it(`Checking mempool of fullnode ${url}`, async () => checkMempool(url))
    });
})