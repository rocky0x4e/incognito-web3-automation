const { ENV } = require('../../../global');
let Web3 = require('web3');
let chai = require('chai');
const web3CommonFuntion = require('../../../constant/web3CommonFuntion');
const { wait } = require('../../../lib/Utils/Timer');


describe(`[EVM] Fullnode`, () => {
    describe(`TC001_Ethereum_Fullnode`, async () => {    
        it(`Call Fullnode`, async () => {
            const host = ENV.EthereumFullnode
            console.log(host)
            const blockNumList1 = await web3CommonFuntion.getBlockNumList(host)
            await wait(20)
            const blockNumList2 = await web3CommonFuntion.getBlockNumList(host)
            chai.assert.notEqual(blockNumList1, blockNumList2, `seem fullnode die`)
            
        }).timedOut(200000)
    })
    describe(`TC002_BSC_Fullnode`, async () => {    
        it(`Call Fullnode`, async () => {
            const host = ENV.BSCFullnode
            console.log(host)
            const blockNum1 = await web3CommonFuntion.getBlockNumList(host)
            await wait(20)
            const blockNum2 = await web3CommonFuntion.getBlockNumList(host)
            chai.assert.notEqual(blockNum1, blockNum2, `seem fullnode die`)
        }).timedOut(200000)
    })
    describe(`TC003_Polygon_Fullnode`, async () => {    
        it(`Call Fullnode`, async () => {
            const host = ENV.PLGFullnode
            console.log(host)
            const blockNum1 = await web3CommonFuntion.getBlockNumList(host)
            await wait(20)
            const blockNum2 = await web3CommonFuntion.getBlockNumList(host)
            chai.assert.notEqual(blockNum1, blockNum2, `seem fullnode die`)
        }).timedOut(200000)
    })
    describe(`TC004_Fantom_Fullnode`, async () => {    
        it(`Call Fullnode`, async () => {
            const host = ENV.FTMFullnode
            console.log(host)
            const blockNum1 = await web3CommonFuntion.getBlockNumList(host)
            await wait(20)
            const blockNum2 = await web3CommonFuntion.getBlockNumList(host)
            chai.assert.notEqual(blockNum1, blockNum2, `seem fullnode die`)
        }).timedOut(200000)
    })
    describe(`TC005_Aurora_Fullnode`, async () => {    
        it(`Call Fullnode`, async () => {
            const host = ENV.AuroraFullnode
            console.log(host)
            const blockNum1 = await web3CommonFuntion.getBlockNumList(host)
            await wait(20)
            const blockNum2 = await web3CommonFuntion.getBlockNumList(host)
            chai.assert.notEqual(blockNum1, blockNum2, `seem fullnode die`)
        }).timedOut(200000)
    })
    describe(`TC006_Avax_Fullnode`, async () => {    
        it(`Call Fullnode`, async () => {
            const host = ENV.AvaxFullnode
            console.log(host)
            const blockNum1 = await web3CommonFuntion.getBlockNumList(host)
            await wait(20)
            const blockNum2 = await web3CommonFuntion.getBlockNumList(host)
            chai.assert.notEqual(blockNum1, blockNum2, `seem fullnode die`)
        }).timedOut(200000)
    })
})