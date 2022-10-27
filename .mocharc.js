module.exports = {
    exit: true,
    bail: false,
    slow: 1000,
    recursive: true,
    timeout: 20000,
    file: [
        './TestCases/TestBase.js',

        './TestCases/monitor/backend/Login.js',
        './TestCases/monitor/backend/Papp.js',
        './TestCases/monitor/coinService/Balance.js',
        './TestCases/monitor/coinService/Liquidity.js',
        './TestCases/monitor/coinService/Market.js',
        './TestCases/monitor/coinService/Pdex.js',
        './TestCases/webBaseV1/BE_EstimateSwap.js',
        './TestCases/webBaseV1/BE_EvmShield.js',
        './TestCases/webBaseV1/BE_EvmUnshield.js',
        './TestCases/webBaseV1/BE_SwapTxHistory.js',
    ],
    reporter: 'node_modules/mochawesome',
    'reporter-option': [
        overwrite = true,
        charts = true,
        timestamp = 'longDate',
    ]
};