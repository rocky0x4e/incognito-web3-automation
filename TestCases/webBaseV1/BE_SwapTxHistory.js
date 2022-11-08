let chai = require('chai');
const { WebServiceApi } = require('../../lib/Incognito/WebServiceApi');
const webServiceApi_schemas = require("../../schemas/webServiceApi_schemas");
const validateSchemaCommand = require("../../schemas/validateSchemaCommand");

let webServiceApi = new WebServiceApi()

describe('[Class] SwapStatus', async() => {

    describe('TC001_Plg_Success', async() => {
        it('STEP_Call_Api_Swap_Status', async() => {

            listTx = ['5de0722c649106b3a5ef5aa90cf179e8ba7258ba11a8449e3965dc1b3fa536ae']

            let response = await webServiceApi.swapStatus({ listTx })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.swapStatusSchemas, response.data)

            //verify
            for (const tx of listTx) {
                chai.assert.equal(response.data.Result[tx].inc_request_tx_status, 'accepted')
                chai.assert.equal(response.data.Result[tx].network_result[0].is_redeposit, true)
                chai.assert.equal(response.data.Result[tx].network_result[0].network, 'plg')
                chai.assert.equal(response.data.Result[tx].network_result[0].swap_outcome, 'success')
                chai.assert.equal(response.data.Result[tx].network_result[0].swap_tx, '0x59bbae8db075c5b8f39e88b1882a0f69c3a8b2f0317d2698e5afb4123cbd1656')
                chai.assert.equal(response.data.Result[tx].network_result[0].redeposit_inctx, '78b6af2e4b98da958cf8358c3747b3a9978248f20657e9cb8b29d897b1a9bd80')
                chai.assert.equal(response.data.Result[tx].network_result[0].swap_tx_status, 'success')
            }
        });
    });

    describe('TC002_Bsc_Success', async() => {
        it('STEP_Call_Api_Swap_Status', async() => {

            listTx = ['44b7c66ad7020404801f324d4fb90b8f76d5e80de753e290433a2c9a1e548e2b']

            let response = await webServiceApi.swapStatus({ listTx })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.swapStatusSchemas, response.data)

            for (const tx of listTx) {
                chai.assert.equal(response.data.Result[tx].inc_request_tx_status, 'accepted')
                chai.assert.equal(response.data.Result[tx].network_result[0].is_redeposit, true)
                chai.assert.equal(response.data.Result[tx].network_result[0].network, 'bsc')
                chai.assert.equal(response.data.Result[tx].network_result[0].swap_outcome, 'success')
                chai.assert.equal(response.data.Result[tx].network_result[0].swap_tx, '0x28a61dbff6f56ab9444e6c1e47476c51a0a8d6df742b84b110d8a4cd3ee0b399')
                chai.assert.equal(response.data.Result[tx].network_result[0].swap_tx_status, 'success')
                chai.assert.equal(response.data.Result[tx].network_result[0].redeposit_inctx, 'd17be0778a5663b8c5dbc7d09d7176a923504515344d7f12ce29cdf724b69ae3')
                chai.assert.equal(response.data.Result[tx].network_result[0].redeposit_status, 'success')
            }
        });
    });

    describe('TC003_Swap_Revert', async() => {
        it('STEP_Call_Api_Swap_Status', async() => {

            listTx = ['d22282e2e92099716805984b7a83935ed8c6fd8f1d36d79da4f1525bda29729f']

            let response = await webServiceApi.swapStatus({ listTx })

            await validateSchemaCommand.validateSchema(webServiceApi_schemas.swapStatusSchemas, response.data)

            for (const tx of listTx) {
                chai.assert.equal(response.data.Result[tx].inc_request_tx_status, 'accepted')
                chai.assert.equal(response.data.Result[tx].network_result[0].is_redeposit, true)
                chai.assert.equal(response.data.Result[tx].network_result[0].swap_outcome, 'reverted')
                chai.assert.equal(response.data.Result[tx].network_result[0].swap_tx_status, 'success')
                chai.assert.equal(response.data.Result[tx].network_result[0].redeposit_inctx, '996bf59639e7110e095cdd93579d9a92edb6c5ad70f3ed8eeb7fa0cdd702ba38')
                chai.assert.equal(response.data.Result[tx].network_result[0].redeposit_status, 'success')
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

            listTx = ['5de0722c649106b3a5ef5aa90cf179e8ba7258ba11a8449e3965dc1b3fa536ae',
                '44b7c66ad7020404801f324d4fb90b8f76d5e80de753e290433a2c9a1e548e2b',
                '54954ed0a4d939e25019590219f28cb5468ee07bb5e4d7e58f27aeff681b3b0c'
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