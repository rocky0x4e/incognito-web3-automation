let chai = require('chai');
const { WebServiceApi } = require('../../lib/Incognito/WebServiceApi');
const { ENV } = require("../../global");
const webServiceApi_schemas = require("../../schemas/webServiceApi_schemas");
const validateSchemaCommand = require("../../schemas/validateSchemaCommand");
const _ = require('lodash');
const addingContent = require('../../testbase/addingContent');

let webServiceApi = new WebServiceApi(ENV.WebService)

describe('[Class] SwapStatus', async() => {

    describe('TC001_Plg_Success', async() => {
        it('STEP_Call_Api_Swap_Status', async() => {

            listTx = ['1108ebb9b138264346fd31c02ed5b08e0819190eab7c45c46b49d46409558972']

            let response = await webServiceApi.swapStatus({ listTx })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.swapStatusSchemas, response.data)

            //verify
            for (const tx of listTx) {
                chai.assert.equal(response.data.Result[tx].inc_request_tx_status, 'accepted')
                chai.assert.equal(response.data.Result[tx].network_result[0].is_redeposit, true)
                chai.assert.equal(response.data.Result[tx].network_result[0].network, 'plg')
                chai.assert.equal(response.data.Result[tx].network_result[0].swap_outcome, 'success')
                chai.assert.equal(response.data.Result[tx].network_result[0].swap_tx, '0x3a65aa41ac1a9dfad407dd409e8b37379d6b020649487800ac5c62512cf4d38a')
                chai.assert.equal(response.data.Result[tx].network_result[0].redeposit_inctx, '602afd070b41140f40d417f63af7efd9bedd48e1ded1b4abdbda953a010af635')
                chai.assert.equal(response.data.Result[tx].network_result[0].swap_tx_status, 'accepted')
            }
        });
    });

    describe('TC002_Bsc_Success', async() => {
        it('STEP_Call_Api_Swap_Status', async() => {

            listTx = ['298ba347f3669b0d67c73455a37e36d2f93cee3e7245f751d156904e3625c8bb']

            let response = await webServiceApi.swapStatus({ listTx })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.swapStatusSchemas, response.data)

            for (const tx of listTx) {
                chai.assert.equal(response.data.Result[tx].inc_request_tx_status, 'accepted')
                chai.assert.equal(response.data.Result[tx].network_result[0].is_redeposit, true)
                chai.assert.equal(response.data.Result[tx].network_result[0].network, 'bsc')
                chai.assert.equal(response.data.Result[tx].network_result[0].swap_outcome, 'success')
                chai.assert.equal(response.data.Result[tx].network_result[0].swap_tx, '0x74add1a81f27f4513686af5369e48ff9a8e2d1c52b3d804862f6c32739acb811')
                chai.assert.equal(response.data.Result[tx].network_result[0].swap_tx_status, 'accepted')
                chai.assert.equal(response.data.Result[tx].network_result[0].redeposit_inctx, '347f6ae3fe5c291d74bb9ee3ce52ad1459e277fb724447ee79cd0f75562c77ac')
                chai.assert.equal(response.data.Result[tx].network_result[0].redeposit_status, 'accepted')
            }
        });
    });

    describe('TC003_Swap_Revert', async() => {
        it('STEP_Call_Api_Swap_Status', async() => {

            listTx = ['e0234830e0294d779174a30e377cbf2e598d3b8685a6a6d1c3564b2c70b99dbb']

            let response = await webServiceApi.swapStatus({ listTx })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.swapStatusSchemas, response.data)

            for (const tx of listTx) {
                chai.assert.equal(response.data.Result[tx].inc_request_tx_status, 'accepted')
                chai.assert.equal(response.data.Result[tx].network_result[0].is_redeposit, true)
                chai.assert.equal(response.data.Result[tx].network_result[0].swap_outcome, 'reverted')
                chai.assert.equal(response.data.Result[tx].network_result[0].swap_tx_status, 'accepted')
                chai.assert.equal(response.data.Result[tx].network_result[0].redeposit_inctx, 'b54a046ac14f3dd4f2a55fbffa2f48a2196e92e88e0835dfb25c84fd08f4cd3c')
                chai.assert.equal(response.data.Result[tx].network_result[0].redeposit_status, 'accepted')
            }
        });
    });

    describe('TC004_Tx_Not_Found', async() => {
        it('STEP_Call_Api_Swap_Status', async() => {

            listTx = ['085a16ec5e6ff5784faa858e9fbb094aad87793a8a34d1007ab571b27ef4a602']

            let response = await webServiceApi.swapStatus({ listTx })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.swapStatusSchemas, response.data)

            for (const tx of listTx) {
                chai.assert.equal(response.data.Result[tx].error, 'not found')
            }
        });
    });

    describe('TC005_Multi_Tx', async() => {
        it('STEP_Call_Api_Swap_Status', async() => {

            listTx = ['0fe3a27694cf9703212194a0a13312356ed1b9807d8a9a89c053c040642a332b',
                '298ba347f3669b0d67c73455a37e36d2f93cee3e7245f751d156904e3625c8bb'
            ]
            let response = await webServiceApi.swapStatus({ listTx })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.swapStatusSchemas, response.data)

            for (const tx of listTx) {
                chai.assert.equal(response.data.Result[tx].inc_request_tx_status, 'accepted')
                chai.assert.equal(response.data.Result[tx].network_result[0].swap_outcome, 'success')
            }
        });
    });
});