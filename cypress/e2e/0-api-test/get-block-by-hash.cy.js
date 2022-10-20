/// <reference types="cypress" />

describe('test rpc request', () => {
    it.only('get block by hash', () => {
        // cy.intercept('POST', 'https://testnet.incognito.org/fullnode').as('testnetFullnode')

        // cy.wait('@testnetFullnode')
        cy.request({
            method: 'POST',
            url: 'https://testnet.incognito.org/fullnode',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                "jsonrpc": "1.0",
                "method": "gettransactionbyhash",
                "params": ["2ac27cc5422acc11237aa7f0f8f582de19866b1a508ca14f55c57a4c1e43fc21"],
                "id": 1
            }
        }).then((res) => {
            cy.log(JSON.stringify(res.body.Result.BlockHeight))
            cy.log(JSON.stringify(res.body.Result.ShardID))
            cy.log(JSON.stringify(res.body.Error))
        })
    })
})