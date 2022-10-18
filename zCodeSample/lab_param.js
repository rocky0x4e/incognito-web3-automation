function testParam({ jsonrpc = "1.0", id = 1, method = "getthis" }) {
    console.log(JSON.stringify(arguments))
}

testParam()