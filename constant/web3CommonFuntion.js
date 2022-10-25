let Web3 = require('web3');

const getBlockNumList =  async(hostlist) => {
    const blockNumList =[]
    for (let i of hostlist){
        let web3 =await  new Web3(new Web3.providers.HttpProvider(i.url));
        await web3.eth.getBlockNumber().then((blockNum) => {
            // console.log('block Num: %s %d', i ,blockNum)
            blockNumList.push(blockNum)
        }).catch(err =>{
            blockNumList.push(0)
            console.log('err :', err)
        })
    }
    return blockNumList 
}


module.exports = {
    getBlockNumList
}