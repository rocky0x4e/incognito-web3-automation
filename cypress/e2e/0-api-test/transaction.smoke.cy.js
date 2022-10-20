/// <reference types="cypress" />

context('test rpc request <TRANSACTION>', () => {
    it('get gettransactionbyhash', () => {
        cy.request({
            method: 'POST',
            url: 'https://testnet.incognito.org/fullnode',
            body: {
                "jsonrpc": "1.0",
                "method": "gettransactionbyhash",
                "params": ["2ac27cc5422acc11237aa7f0f8f582de19866b1a508ca14f55c57a4c1e43fc21"],
                "id": 1
            }
        }).then((res) => {
            cy.log("BlockHeight=" + JSON.stringify(res.body.Result.BlockHeight))
            cy.log("ShardID=" + JSON.stringify(res.body.Result.ShardID))
            expect(res.body.Result.ShardID).to.eq(0)
            cy.log("Error=" + JSON.stringify(res.body.Error))
        })
    })
})