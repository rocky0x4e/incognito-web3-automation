module.exports = {
    exit: true,
    bail: false,
    slow: 1000,
    recursive: true,
    timeout: 20000,
    spec: [
        // './TestCases/TestBase.js',

        // './TestCases/monitor/backend',
        // './TestCases/monitor/coinService',
        // './TestCases/webBaseV1',
    ],
    reporter: 'node_modules/mochawesome',
    'reporter-option': [
        (overwrite = true),
        (charts = true),
        (timestamp = 'longDate'),
    ],
};