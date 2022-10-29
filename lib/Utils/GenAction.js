const randomNumber = async(number) => {
    let result = 0
    while (result == 0) {
        result = Math.floor(Math.random() * number);
    }
    return result
}

const sleep = async(ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}



module.exports = {
    randomNumber,

}