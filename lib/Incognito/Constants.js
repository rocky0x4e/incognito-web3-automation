const TOKEN = { "PRV": "0000000000000000000000000000000000000000000000000000000000000004" }
const STATUS = {
    SubmitKey: {
        NotSubmitted: 0,
        Waiting: 1,
        SubmitedNormal: 2,
        SubmitedEnhanced: 3,
    }
}

module.exports = { TOKEN, STATUS }