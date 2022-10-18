const api = require('./api');
const fs = require('fs')
const config = require('./config')

let listTokenCS = []
let listPoolVerifyCS = []

const newToken = async() => {
    // console.log( global.urlBackendTool)

    let url = global.urlBackend + `/auth/new-token`
    let body = {
            "DeviceID": "DE30C4FF-3BA4-4AA0-9D22-5C6755C1287D",
            "DeviceToken": "ci-Lk6XF5YE:APA91bFtZBN-dfPXECLdMymqOP8x3lbYadjioNCReYEyVM3E1APzGsxaC9_2utIvL1F12O347-T0KU7OO-vHtWrXWtQ4yUjXaBFYPmwCjuOv3N1A64B1Vqmxa_H4w8dS921JL0yHi3pf"
        }
        // console.log({ url });
    let response = await api.post(url, body)
    return response.Result.Token
}



module.exports = {
    newToken
}