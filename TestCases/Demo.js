const run = async(privateKey) => {
    let sender = new IncAccount((await config.getAccount('3')).privateKey).attachTo(node)
}

run()