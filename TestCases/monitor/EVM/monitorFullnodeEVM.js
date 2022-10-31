const { ENV } = require('../../../global');
let Web3 = require('web3');
let chai = require('chai');
// const web3CommonFuntion = require('../../../constant/web3CommonFuntion');
const { wait } = require('../../../lib/Utils/Timer');


describe(`[EVM] Fullnode`, () => {
    describe(`TC001_Ethereum_Fullnode`, async () => {
        it(`Call Fullnode`, async () => {
            const host = ENV.EthereumFullnode
            console.log(host)
            const blockNumList1 = await getBlockNumList(host)
            await wait(20)
            const blockNumList2 = await getBlockNumList(host)
            chai.assert.notEqual(blockNumList1, blockNumList2, `seem fullnode die`)

        }).timedOut(200000)
    })
    describe(`TC002_BSC_Fullnode`, async () => {
        it(`Call Fullnode`, async () => {
            const host = ENV.BSCFullnode
            console.log(host)
            const blockNum1 = await getBlockNumList(host)
            await wait(20)
            const blockNum2 = await getBlockNumList(host)
            chai.assert.notEqual(blockNum1, blockNum2, `seem fullnode die`)
        }).timedOut(200000)
    })
    describe(`TC003_Polygon_Fullnode`, async () => {
        it(`Call Fullnode`, async () => {
            const host = ENV.PLGFullnode
            console.log(host)
            const blockNum1 = await getBlockNumList(host)
            await wait(20)
            const blockNum2 = await getBlockNumList(host)
            chai.assert.notEqual(blockNum1, blockNum2, `seem fullnode die`)
        }).timedOut(200000)
    })
    describe(`TC004_Fantom_Fullnode`, async () => {
        it(`Call Fullnode`, async () => {
            const host = ENV.FTMFullnode
            console.log(host)
            const blockNum1 = await getBlockNumList(host)
            await wait(20)
            const blockNum2 = await getBlockNumList(host)
            chai.assert.notEqual(blockNum1, blockNum2, `seem fullnode die`)
        }).timedOut(200000)
    })
    describe(`TC005_Aurora_Fullnode`, async () => {
        it(`Call Fullnode`, async () => {
            const host = ENV.AuroraFullnode
            console.log(host)
            const blockNum1 = await getBlockNumList(host)
            await wait(20)
            const blockNum2 = await getBlockNumList(host)
            chai.assert.notEqual(blockNum1, blockNum2, `seem fullnode die`)
        }).timedOut(200000)
    })
    describe(`TC006_Avax_Fullnode`, async () => {
        it(`Call Fullnode`, async () => {
            const host = ENV.AvaxFullnode
            console.log(host)
            const blockNum1 = await getBlockNumList(host)
            await wait(20)
            const blockNum2 = await getBlockNumList(host)
            chai.assert.notEqual(blockNum1, blockNum2, `seem fullnode die`)
        }).timedOut(200000)
    })
})



async function getBlockNumList(hostlist) {
    const blockNumList = []
    for (let i of hostlist) {
        let web3 = await new Web3(new Web3.providers.HttpProvider(i.url));
        await web3.eth.getBlockNumber().then((blockNum) => {
            // console.log('block Num: %s %d', i ,blockNum)
            blockNumList.push(blockNum)
        }).catch(err => {
            blockNumList.push(0)
            console.log('err :', err)
        })
    }
    return blockNumList
}