const { IncAccount } = require("./lib/Incognito/Account/Account")
const config = require('./constant/config');
const { BackendApi } = require("./lib/Incognito/BackendApi");
const { IncNode } = require("./lib/Incognito/IncNode");
const { ENV } = require("./global");


const run = async() => {
    let privateKey = (await config.getAccount('main7')).privateKey

    let backendApi = new BackendApi(ENV.Backend)
    let node = new IncNode()
    console.log('hoanh node', node);
    let acc = new IncAccount(privateKey).attachTo(node)
    console.log('hoanh acc', acc);
    let paymentK = acc.paymentK
    console.log('hoanh paymentK', paymentK);
}

run()