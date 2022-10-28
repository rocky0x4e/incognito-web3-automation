const { IncNode } = require("../../../lib/Incognito/IncNode");
const chai = require('chai');
const { wait } = require("../../../lib/Utils/Timer");
const { incFullnodes } = require("./data");
const gap = 15

async function checkIncognitoFullnode(nodeUrl) {
    var node = new IncNode(nodeUrl)
    var h = 0
    var time = gap
    while (time > -gap) {
        latestHeight = await node.getCurrentBeaconHeight()
        chai.assert(latestHeight > h, `${latestHeight} >< ${h}`)
        await wait(gap)
        time -= gap
    }

}

async function checkIncognitoBackend() {

}

describe("Check all fullnodes alive", async () => {
    incFullnodes.forEach(node => {
        it(`checking fullnode ${node}`, () => checkIncognitoFullnode(node))
    });
})