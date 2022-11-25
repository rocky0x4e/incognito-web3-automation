const genShieldAddressSchemas = {
    "$id": "genShieldAddressSchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome2",
    "definitions": {
        "Welcome2": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
                "Result": {
                    "$ref": "#/definitions/Result"
                },
                "Error": {
                    "type": "null"
                }
            },
            "required": [
                "Error",
                "Result"
            ],
            "title": "Welcome2"
        },
        "Result": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
                "Address": {
                    "type": "string"
                },
                "Decentralized": {
                    "type": "integer"
                },
                "EstimateFee": {
                    "type": "number"
                },
                "ExpiredAt": {
                    "type": "string",
                    "format": "date-time"
                },
                "ID": {
                    "type": "integer"
                },
                "TokenFee": {
                    "type": "number"
                }
            },
            "required": [
                "Address",
                "Decentralized",
                "EstimateFee",
                "ExpiredAt",
                "ID",
                "TokenFee"
            ],
            "title": "Result"
        }
    }
};

const genShieldAddressBTCSchemas = {
    "$id": "genShieldAddressBTCSchemas",
    "type": "object",
    "properties": {
        "Result": {
            "type": "string"
        }
    },
    "required": [
        "Result"
    ]
};

const estimateSwapFeeSchemas = {
    "$id": "estimateSwapFeeSchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome3",
    "definitions": {
        "Welcome3": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
                "Result": {
                    "$ref": "#/definitions/Result"
                },
                "Error": {
                    "type": "null"
                }
            },
            "required": [
                "Error",
                "Result"
            ],
            "title": "Welcome3"
        },
        "Result": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
                "Networks": {
                    "$ref": "#/definitions/Networks"
                },
                "NetworksError": {
                    "$ref": "#/definitions/NetworksError"
                }
            },
            "required": [
                "Networks",
                "NetworksError"
            ],
            "title": "Result"
        },
        "Networks": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
                "bsc": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Bsc"
                    }
                },
                "eth": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Eth"
                    }
                },
                "plg": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Plg"
                    }
                },
                "ftm": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Ftm"
                    }
                }
            },
            "required": [],
            "title": "Networks"
        },
        "Bsc": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
                "AppName": {
                    "type": "string"
                },
                "CallContract": {
                    "type": "string"
                },
                "AmountIn": {
                    "type": "string"
                },
                "AmountInRaw": {
                    "type": "string"
                },
                "AmountOut": {
                    "type": "string"
                },
                "AmountOutRaw": {
                    "type": "string"
                },
                "AmountOutPreSlippage": {
                    "type": "string"
                },
                "RedepositReward": {
                    "type": "string",

                },
                "Rate": {
                    "type": "string"
                },
                "Fee": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Fee"
                    }
                },
                "FeeAddress": {
                    "type": "string"
                },
                "FeeAddressShardID": {
                    "type": "integer"
                },
                "Paths": {
                    "type": "string",
                },
                "PoolPairs": {
                    "type": "null"
                },
                "Calldata": {
                    "type": "string"
                },
                "ImpactAmount": {
                    "type": "string"
                },

            },
            "required": [
                "AmountIn",
                "AmountInRaw",
                "AmountOut",
                "AmountOutPreSlippage",
                "AmountOutRaw",
                "AppName",
                "CallContract",
                "Calldata",
                "Fee",
                "FeeAddress",
                "FeeAddressShardID",
                "ImpactAmount",
                "Paths",
                "PoolPairs",
                "Rate",
                "RedepositReward",
            ],
            "title": "Bsc"
        },
        "Eth": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
                "AppName": {
                    "type": "string"
                },
                "CallContract": {
                    "type": "string"
                },
                "AmountIn": {
                    "type": "string"
                },
                "AmountInRaw": {
                    "type": "string"
                },
                "AmountOut": {
                    "type": "string"
                },
                "AmountOutRaw": {
                    "type": "string"
                },
                "AmountOutPreSlippage": {
                    "type": "string"
                },
                "RedepositReward": {
                    "type": "string",

                },
                "Rate": {
                    "type": "string"
                },
                "Fee": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Fee"
                    }
                },
                "FeeAddress": {
                    "type": "string"
                },
                "FeeAddressShardID": {
                    "type": "integer"
                },
                "Paths": {
                    "type": "string",
                },
                "PoolPairs": {
                    "type": "null"
                },
                "Calldata": {
                    "type": "string"
                },
                "ImpactAmount": {
                    "type": "string"
                },

            },
            "required": [
                "AmountIn",
                "AmountInRaw",
                "AmountOut",
                "AmountOutPreSlippage",
                "AmountOutRaw",
                "AppName",
                "CallContract",
                "Calldata",
                "Fee",
                "FeeAddress",
                "FeeAddressShardID",
                "ImpactAmount",
                "Paths",
                "PoolPairs",
                "Rate",
                "RedepositReward",
            ],
            "title": "Bsc"
        },
        "Plg": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
                "AppName": {
                    "type": "string"
                },
                "CallContract": {
                    "type": "string"
                },
                "AmountIn": {
                    "type": "string"
                },
                "AmountInRaw": {
                    "type": "string"
                },
                "AmountOut": {
                    "type": "string"
                },
                "AmountOutRaw": {
                    "type": "string"
                },
                "AmountOutPreSlippage": {
                    "type": "string"
                },
                "RedepositReward": {
                    "type": "string",

                },
                "Rate": {
                    "type": "string"
                },
                "Fee": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Fee"
                    }
                },
                "FeeAddress": {
                    "type": "string"
                },
                "FeeAddressShardID": {
                    "type": "integer"
                },
                "Paths": {
                    "type": "string",
                },
                "PoolPairs": {
                    "type": "null"
                },
                "Calldata": {
                    "type": "string"
                },
                "ImpactAmount": {
                    "type": "string"
                },
            },
            "required": [
                "AmountIn",
                "AmountInRaw",
                "AmountOut",
                "AmountOutPreSlippage",
                "AmountOutRaw",
                "AppName",
                "CallContract",
                "Calldata",
                "Fee",
                "FeeAddress",
                "FeeAddressShardID",
                "ImpactAmount",
                "Paths",
                "PoolPairs",
                "Rate",
                "RedepositReward",
            ],
            "title": "Bsc"
        },
        "Ftm": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
                "AppName": {
                    "type": "string"
                },
                "CallContract": {
                    "type": "string"
                },
                "AmountIn": {
                    "type": "string"
                },
                "AmountInRaw": {
                    "type": "string"
                },
                "AmountOut": {
                    "type": "string"
                },
                "AmountOutRaw": {
                    "type": "string"
                },
                "AmountOutPreSlippage": {
                    "type": "string"
                },
                "RedepositReward": {
                    "type": "string",

                },
                "Rate": {
                    "type": "string"
                },
                "Fee": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Fee"
                    }
                },
                "FeeAddress": {
                    "type": "string"
                },
                "FeeAddressShardID": {
                    "type": "integer"
                },
                "Paths": {
                    "type": "string",
                },
                "PoolPairs": {
                    "type": "null"
                },
                "Calldata": {
                    "type": "string"
                },
                "ImpactAmount": {
                    "type": "string"
                },
            },
            "required": [
                "AmountIn",
                "AmountInRaw",
                "AmountOut",
                "AmountOutPreSlippage",
                "AmountOutRaw",
                "AppName",
                "CallContract",
                "Calldata",
                "Fee",
                "FeeAddress",
                "FeeAddressShardID",
                "ImpactAmount",
                "Paths",
                "PoolPairs",
                "Rate",
                "RedepositReward",
            ],
            "title": "Bsc"
        },
        "Fee": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
                "tokenid": {
                    "type": "string"
                },
                "amount": {
                    "type": "integer"
                },
                "amountInBuyToken": {
                    "type": "string"
                }
            },
            "required": [
                "amount",
                "amountInBuyToken",
                "tokenid"
            ],
            "title": "Fee"
        },
        "NetworksError": {
            "type": "object",
            "additionalProperties": true,
            "title": "NetworksError"
        }
    }
};

const genUnshieldAddressSchemas = {
    "$id": "genShieldAddressSchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome7",
    "definitions": {
        "Welcome7": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
                "Result": {
                    "$ref": "#/definitions/Result"
                },
                "Error": {
                    "type": "null"
                }
            },
            "required": [
                "Error",
                "Result"
            ],
            "title": "Welcome7"
        },
        "Result": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
                "EstimateReceivedAmount": {
                    "$ref": "#/definitions/EstimateReceivedAmount"
                },
                "FeeAddress": {
                    "type": "string"
                },
                "ID": {
                    "type": "integer"
                },
                "TokenFees": {
                    "$ref": "#/definitions/TokenFees"
                }
            },
            "required": [
                "EstimateReceivedAmount",
                "FeeAddress",
                "ID",
                "TokenFees"
            ],
            "title": "Result"
        },
        "EstimateReceivedAmount": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
                "BurntAmount": {
                    "type": "integer"
                },
                "ExpectedAmount": {
                    "type": "integer"
                },
                "Fee": {
                    "type": "integer"
                }
            },
            "required": [
                "BurntAmount",
                "ExpectedAmount",
                "Fee"
            ],
            "title": "EstimateReceivedAmount"
        },
        "TokenFees": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
                "Level1": {
                    "type": "string",

                }
            },
            "required": [
                "Level1"
            ],
            "title": "TokenFees"
        }
    }
};

const swapStatusSchemas = {
    "$id": "swapStatusSchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome9",
    "definitions": {
        "Welcome9": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Result": {
                    "$ref": "#/definitions/Result"
                }
            },
            "required": [
                "Result"
            ],
            "title": "Welcome9"
        },
        "Result": {
            "type": "object",
            "additionalProperties": true,
            "properties": {},
            "required": [

            ],
            "title": "Result"
        },

        "NetworkResult": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "is_redeposit": {
                    "type": "boolean"
                },
                "network": {
                    "type": "string"
                },
                "redeposit_inctx": {
                    "type": "string"
                },
                "redeposit_status": {
                    "type": "string"
                },
                "swap_outcome": {
                    "type": "string"
                },
                "swap_tx": {
                    "type": "string"
                },
                "swap_tx_status": {
                    "type": "string"
                }
            },
            "required": [
                "is_redeposit",
                "network",
                "redeposit_inctx",
                "redeposit_status",
                "swap_outcome",
                "swap_tx",
                "swap_tx_status"
            ],
            "title": "NetworkResult"
        }
    }
};

module.exports = {
    genShieldAddressSchemas,
    genShieldAddressBTCSchemas,
    genUnshieldAddressSchemas,
    estimateSwapFeeSchemas,
    swapStatusSchemas
}