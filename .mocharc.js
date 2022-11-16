module.exports = {
    exit: true,
    bail: false,
    slow: 1000,
    recursive: true,
    timeout: 20000,
    spec: [
        './TestCases/TestBase.js',

        './TestCases/monitor/backend',
        './TestCases/monitor/coinService',
        './TestCases/monitor/checkAlive',
        './TestCases/monitor/EVM',
        './TestCases/webBaseV1',
        './TestCases/webBaseV2',
        './TestCases/endToEnd/pDex/Pdex.js',
    ],
    reporter: 'node_modules/mochawesome',
    'reporter-option': [
        (overwrite = true),
        (charts = true),
        (timestamp = 'longDate'),
    ],
};