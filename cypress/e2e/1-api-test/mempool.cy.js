/// <reference types="cypress" />

describe('test MEMPOOL rpc request', () => {
    it.only('get mempool info', () => {
        cy.request({
            method: 'POST',
            url: 'https://testnet.incognito.org/fullnode',
            body: {
                "jsonrpc": "1.0",
                "method": "getmempoolinfo",
                "id": 1
            }
        }).then((res) => {
            cy.log("Result=" + JSON.stringify(res.body.Result))

        })
    })

})