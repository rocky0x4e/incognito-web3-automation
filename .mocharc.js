module.exports = {
    exit: true,
    bail: false,
    slow: 1000,
    recursive: true,
    timeout: 20000,
    file: [
        './TestCases/TestBase.js',

        // './Testcases/monitor/backend/Login.js',
        // './Testcases/monitor/backend/Papp.js',
        // './Testcases/monitor/coinService/Balance.js',
        // './Testcases/monitor/coinService/Liquidity.js',
        // './Testcases/monitor/coinService/Market.js',
        // './Testcases/monitor/coinService/Pdex.js',
        // './Testcases/webBaseV1/BE_EstimateSwap.js',
        './Testcases/webBaseV1/BE_EvmShield.js',
    ],
    reporter: 'node_modules/mochawesome',
    'reporter-option': [
        overwrite = true,
        charts = true,
        timestamp = 'longDate',
    ]
};