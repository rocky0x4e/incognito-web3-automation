module.exports = {
    exit: true,
    bail: true,
    slow: 1000,
    recursive: true,
    file: ['./Testcases/monitor/backend/Login.js',
        './Testcases/monitor/backend/Papp.js',
        './Testcases/monitor/coinService/Balance.js',
        './Testcases/monitor/coinService/Liquidity.js',
        './Testcases/monitor/coinService/Market.js',
        './Testcases/monitor/coinService/Pdex.js',
    ],
    reporter: 'node_modules/mochawesome',
    'reporter-option': [
        'overwrite=true',
        'charts=true',
        'timestamp:longDate',
    ]
};