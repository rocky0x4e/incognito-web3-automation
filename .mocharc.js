module.exports = {
    exit: true,
    bail: false,
    slow: 1000,
    recursive: true,
    timeout: 2000000000,
    spec: [
        // './TestCases/TestBase.js',

        // './TestCases/monitor/backend',
        // './TestCases/monitor/coinService',
        // './TestCases/monitor/checkAlive',
        // './TestCases/monitor/EVM/bridgeEthereum.js',
        // './TestCases/monitor/EVM/bridgeBSC.js',
        './TestCases/monitor/EVM/bridgePolygon.js',
        // './TestCases/monitor/EVM/bridgeFantom.js',
        // './TestCases/monitor/EVM/bridgeAvax.js',
        // './TestCases/webBaseV1',
    ],
    reporter: 'node_modules/mochawesome',
    'reporter-option': [
        (overwrite = true),
        (charts = true),
        (timestamp = 'longDate'),
    ],
}