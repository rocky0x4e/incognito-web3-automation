const fetch = require("node-fetch");

const post = async(url, body) => {
    let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body), // string or object
        headers: {
            'Content-Type': 'application/json'
        }
    });
    response = await response.json();
    return response
}

const postWithToken = async(url, token, body) => {
    let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body), // string or object
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
    response = await response.json();
    return response
}

const get = async(url) => {
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    response = await response.json();
    return response
}

const getWithToken = async(url, token) => {
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
    response = await response.json();
    return response
}

module.exports = { post, get, postWithToken, getWithToken }