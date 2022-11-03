const TOKEN = {
    "PRV": "0000000000000000000000000000000000000000000000000000000000000004",
    "ETH" : "ffd8d42dc40a8d166ea4848baf8b5f6e9fe0e9c30d60062eb7d44a8df9e00854",
    "UnifiedETH": "b366fa400c36e6bbcf24ac3e99c90406ddc64346ab0b7ba21e159b83d938812d",
    "BNB": "e5032c083f0da67ca141331b6005e4a3740c50218f151a5e829e9d03227e33e2",
    "UnifiedBNB": "c3af83ad2e7b9e040a73a2b9334f9a9664cd1266462f75b6ba84f36139cdf3c6",
    "MATIC": "dae027b21d8d57114da11209dce8eeb587d01adf59d4fc356a8be5eedc146859",
    "UnifiedMATIC": "f5d88e2e3c8f02d6dc1e01b54c90f673d730bef7d941aeec81ad1e1db690961f",
    "FTM": "6eed691cb14d11066f939630ff647f5f1c843a8f964d9a4d295fa9cd1111c474",
    "UnifiedFTM": "ebc1c1b5819aa5647192aefd729ef18cd8894d22656e8add678c0aef93e404d4",
    "AVAX": "c469fb02623a023b469c81e1564193da7d85fe918cd4a4fdd2c64f97f59f60f5",
    "UnifiedAVAX": "5075e4903091b61d2a7a3dd9cd5d369b026900301dadbadefef3e35a77ac4073",
    "ETHAURORA": "a189f306574f75733e93a260b168d8a335ba3243899254b3a4bf5f4de69a8e71"
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