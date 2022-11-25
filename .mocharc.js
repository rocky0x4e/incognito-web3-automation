module.exports = {
    exit: true,
    bail: false,
    slow: 1000,
    recursive: true,
    timeout: 20000,
    // parallel: true,
    spec: [
        // './TestCases/TestBase.js',

        './TestCases/monitor/backend/Login.js',
        './TestCases/monitor/backend/Papp.js',
        './TestCases/monitor/coinService',
        './TestCases/webBaseV1',
        './TestCases/webBaseV2',
        './TestCases/endToEnd/pDex',
        './TestCases/endToEnd/send',
        './TestCases/endToEnd/papp',
    ],
    reporter: 'node_modules/mochawesome',
    'reporter-option': [
        (overwrite = true),
        (charts = true),
        (timestamp = 'longDate'),
    ],
}