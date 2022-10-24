//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
const cliCommonFunction = require('../../../constant/cliCommonFunction');
const chainCommonFunction = require('../../../constant/chainCommonFunction');
const csCommonFunction = require('../../../constant/csCommonFunction');
const coinServiceApi = require('../../../models/coinServiceApi');
const webServiceApi = require('../../../models/webServiceApi');
const beCommonFunction = require('../../../constant/beCommonFunction');
const common = require('../../../constant/commonFunction');
const addingContent = require('../../../testbase/addingContent');


//Our parent block
describe('[Class] SwapStatus', async() => {

    describe('TC001_Plg_Success', async() => {
        it('STEP_Call_Api_Swap_Status', async() => {

            listTx = ['1108ebb9b138264346fd31c02ed5b08e0819190eab7c45c46b49d46409558972']

            let response = await webServiceApi.Api_SwapStatus(listTx)

            //verify
            chai.expect(response).be.a('object');
            for (const tx of listTx) {
                chai.expect(response.Result).have.property(tx)
                chai.expect(response.Result[tx]).have.property('inc_request_tx_status')
                chai.assert.equal(response.Result[tx].inc_request_tx_status, 'accepted')

                chai.expect(response.Result[tx]).have.property('network_result')
                chai.expect(response.Result[tx].network_result[0]).have.property('is_redeposit')
                chai.assert.equal(response.Result[tx].network_result[0].is_redeposit, false)

                chai.expect(response.Result[tx].network_result[0]).have.property('network')
                chai.assert.equal(response.Result[tx].network_result[0].network, 'plg')

                chai.expect(response.Result[tx].network_result[0]).have.property('swap_outcome')
                chai.assert.equal(response.Result[tx].network_result[0].swap_outcome, 'success')

                chai.expect(response.Result[tx].network_result[0]).have.property('swap_tx')
                chai.assert.equal(response.Result[tx].network_result[0].swap_tx, '0xe3faf2891589ce488af1c4569c266137dad1d1a4f104ece130ed466005adc8c2')

                chai.expect(response.Result[tx].network_result[0]).have.property('swap_tx_status')
                chai.assert.equal(response.Result[tx].network_result[0].swap_tx_status, 'accepted')
            }
        });
    });

    describe('TC002_Bsc_Success', async() => {
        it('STEP_Call_Api_Swap_Status', async() => {

            listTx = ['298ba347f3669b0d67c73455a37e36d2f93cee3e7245f751d156904e3625c8bb']

            let response = await webServiceApi.Api_SwapStatus(listTx)

            //verify
            chai.expect(response).be.a('object');
            for (const tx of listTx) {
                chai.expect(response.Result).have.property(tx)
                chai.expect(response.Result[tx]).have.property('inc_request_tx_status')
                chai.assert.equal(response.Result[tx].inc_request_tx_status, 'accepted')

                chai.expect(response.Result[tx]).have.property('network_result')
                chai.expect(response.Result[tx].network_result[0]).have.property('is_redeposit')
                chai.assert.equal(response.Result[tx].network_result[0].is_redeposit, true)

                chai.expect(response.Result[tx].network_result[0]).have.property('network')
                chai.assert.equal(response.Result[tx].network_result[0].network, 'bsc')

                chai.expect(response.Result[tx].network_result[0]).have.property('swap_outcome')
                chai.assert.equal(response.Result[tx].network_result[0].swap_outcome, 'success')

                chai.expect(response.Result[tx].network_result[0]).have.property('swap_tx')
                chai.assert.equal(response.Result[tx].network_result[0].swap_tx, '0x74add1a81f27f4513686af5369e48ff9a8e2d1c52b3d804862f6c32739acb811')

                chai.expect(response.Result[tx].network_result[0]).have.property('swap_tx_status')
                chai.assert.equal(response.Result[tx].network_result[0].swap_tx_status, 'accepted')

                chai.expect(response.Result[tx].network_result[0]).have.property('redeposit_inctx')
                chai.assert.equal(response.Result[tx].network_result[0].redeposit_inctx, '347f6ae3fe5c291d74bb9ee3ce52ad1459e277fb724447ee79cd0f75562c77ac')

                chai.expect(response.Result[tx].network_result[0]).have.property('redeposit_status')
                chai.assert.equal(response.Result[tx].network_result[0].redeposit_status, 'accepted')

            }
        });
    });

    describe('TC003_Swap_Revert', async() => {
        it('STEP_Call_Api_Swap_Status', async() => {

            listTx = ['e0234830e0294d779174a30e377cbf2e598d3b8685a6a6d1c3564b2c70b99dbb']

            let response = await webServiceApi.Api_SwapStatus(listTx)

            //verify
            chai.expect(response).be.a('object');
            for (const tx of listTx) {
                chai.expect(response.Result).have.property(tx)
                chai.expect(response.Result[tx]).have.property('inc_request_tx_status')
                chai.assert.equal(response.Result[tx].inc_request_tx_status, 'accepted')

                chai.expect(response.Result[tx]).have.property('network_result')
                chai.expect(response.Result[tx].network_result[0]).have.property('is_redeposit')
                chai.assert.equal(response.Result[tx].network_result[0].is_redeposit, true)

                chai.expect(response.Result[tx].network_result[0]).have.property('swap_outcome')
                chai.assert.equal(response.Result[tx].network_result[0].swap_outcome, 'reverted')

                chai.expect(response.Result[tx].network_result[0]).have.property('swap_tx_status')
                chai.assert.equal(response.Result[tx].network_result[0].swap_tx_status, 'accepted')

                chai.expect(response.Result[tx].network_result[0]).have.property('redeposit_inctx')
                chai.assert.equal(response.Result[tx].network_result[0].redeposit_inctx, 'b54a046ac14f3dd4f2a55fbffa2f48a2196e92e88e0835dfb25c84fd08f4cd3c')

                chai.expect(response.Result[tx].network_result[0]).have.property('redeposit_status')
                chai.assert.equal(response.Result[tx].network_result[0].redeposit_status, 'accepted')

            }
        });
    });

    describe('TC004_Tx_Not_Found', async() => {
        it('STEP_Call_Api_Swap_Status', async() => {

            listTx = ['085a16ec5e6ff5784faa858e9fbb094aad87793a8a34d1007ab571b27ef4a602']

            let response = await webServiceApi.Api_SwapStatus(listTx)

            //verify
            chai.expect(response).be.a('object');
            for (const tx of listTx) {
                chai.expect(response.Result).have.property(tx)
                chai.assert.equal(response.Result[tx].error, 'not found')
            }
        });
    });

    describe('TC005_Multi_Tx', async() => {
        it('STEP_Call_Api_Swap_Status', async() => {

            listTx = ['0fe3a27694cf9703212194a0a13312356ed1b9807d8a9a89c053c040642a332b',
                '298ba347f3669b0d67c73455a37e36d2f93cee3e7245f751d156904e3625c8bb'
            ]

            let response = await webServiceApi.Api_SwapStatus(listTx)

            //verify
            chai.expect(response).be.a('object');
            for (const tx of listTx) {
                chai.expect(response.Result).have.property(tx)
                chai.expect(response.Result[tx]).have.property('inc_request_tx_status')
                chai.assert.equal(response.Result[tx].inc_request_tx_status, 'accepted')

                chai.expect(response.Result[tx]).have.property('network_result')
                chai.expect(response.Result[tx].network_result[0]).have.property('is_redeposit')
                chai.expect(response.Result[tx].network_result[0]).have.property('network')
                chai.expect(response.Result[tx].network_result[0]).have.property('swap_outcome')
                chai.assert.equal(response.Result[tx].network_result[0].swap_outcome, 'success')
                chai.expect(response.Result[tx].network_result[0]).have.property('swap_tx')
                chai.expect(response.Result[tx].network_result[0]).have.property('swap_tx_status')
            }
        });
    });




});