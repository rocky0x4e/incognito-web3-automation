# incognito-web3-automation

## coding convention:
Please strictly follow this [W3schools' JS coding convention](https://www.w3schools.com/js/js_conventions.asp), or for short:
- Method/function: must be started with a verb (get, set, list, print, show ....)
- Var name must follow camel case format (tokenId, privateKey, sender, receiver, beaconBestState)
- Constants, global var: all cap, except require("lib") ()
- Class name: cap first chard of words (IncRpc, IncAccount, EvmAccount...)
- Avoid underscore (_)
- Line max length = 120

## structure:
.
├── bin (binary files for cli tools)
├── environments (contain json file describe pre-define environments)
├── lib
│   ├── Base                            Base classes
│   ├── EVM                             API for Evm network
│   ├── Incognito                       API for Incognito network
│   └── Utils                           common utils
├── schemas
├── TestCases                           Contain test suites
│   ├── TestSuite1-[name]               Test suite 1
│   ├── TestSuite2-[name]               Test suite 2
|   |   ...
│   ├── ContentManager.js
│   └── TestBase.js                     basic setup - teardown config
├── zCodeSample                         code sample on how to use lib
├── config.json
├── global.js                           global settings, should not be modified
├── package.json
├── package-lock.json
└── README.md


