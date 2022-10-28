const TOKEN = { "PRV": "0000000000000000000000000000000000000000000000000000000000000004",
                "ETH" : "ffd8d42dc40a8d166ea4848baf8b5f6e9fe0e9c30d60062eb7d44a8df9e00854",
                "UnifiedETH" : "b366fa400c36e6bbcf24ac3e99c90406ddc64346ab0b7ba21e159b83d938812d" 
             }
const STATUS = {
    SubmitKey: {
        NotSubmitted: 0,
        Waiting: 1,
        SubmitedNormal: 2,
        SubmitedEnhanced: 3,
    }
}

module.exports = { TOKEN, STATUS }