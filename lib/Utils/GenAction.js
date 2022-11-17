const fs = require('fs')

const randomNumber = async(number) => {
    let result = 0
    while (result == 0) {
        result = Math.floor(Math.random() * number);
    }
    return result
}

const randomNumberInRange = async(numberMin, numberMax) => {
    let result = 0
    while (result == 0) {
        result = Math.floor(Math.random() * (numberMax - numberMin) + numberMin);
    }
    return result
}

const sleep = async(ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const readFile = async(path) => {
    try {
        const jsonString = fs.readFileSync(path);
        const result = JSON.parse(jsonString);
        return result
    } catch (err) {
        console.log(err);
        return;
    }
}

const getListFileName = async(path) => {
    let result = []
    fs.readdirSync(path).forEach(file => {
        result.push(file);
    });
    return result
}

const removeFile = async(path) => {
    try {
        fs.unlinkSync(path);
    } catch (error) {
        if ((error + "").includes('no such file or directory')) {
            console.log("no such file or directory");
        } else {
            console.log(error);
        }
    }
}



module.exports = {
    randomNumber,
    randomNumberInRange,
    sleep,
    readFile,
    getListFileName,
    removeFile
}