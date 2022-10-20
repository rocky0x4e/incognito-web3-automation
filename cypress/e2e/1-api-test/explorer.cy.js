/// <reference types="cypress" />

describe('test EXPLORER rpc request', () => {
    it('getblockchaininfo', () => {
        cy.request({
            method: 'POST',
            url: 'https://testnet.incognito.org/fullnode',
            body: {
                "jsonrpc": "1.0",
                "method": "getblockchaininfo",
                "params": [],
                "id": 1
            }
        }).then((res) => {
            cy.log("ChainName=" + JSON.stringify(res.body.Result.ChainName))
            cy.log("Beacon=" + JSON.stringify(res.body.Result.BestBlocks[-1].Height))
        })
    })
    it('get beacon block by height', () => {
        cy.request({
            method: 'POST',
            url: 'https://testnet.incognito.org/fullnode',
            body: {
                "jsonrpc": "1.0",
                "method": "retrievebeaconblockbyheight",
                "params": [
                    1622599,
                    "2"
                ],
                "id": 1
            }
        })
            .then((res) => {
                cy.log("Height=" + JSON.stringify(res.body.Result[0].Height))
                expect(res.body.Result[0].Height).to.eq(1622599)
                cy.log("Epoch=" + JSON.stringify(res.body.Result[0].Epoch))
                cy.log("Error=" + JSON.stringify(res.body.Error))
            })
    })
})