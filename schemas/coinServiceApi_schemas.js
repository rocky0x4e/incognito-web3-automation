const getTokenListSchemas = {
    "$id": "tokenListSchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome2",
    "definitions": {
        "Welcome2": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Result": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Result"
                    }
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
                "TokenID": {
                    "type": "string"
                },
                "Name": {
                    "type": "string"
                },
                "Symbol": {
                    "type": "string"
                },
                "Image": {
                    "type": "string"
                },
                "IsPrivacy": {
                    "type": "boolean"
                },
                "IsBridge": {
                    "type": "boolean"
                },
                "ExternalID": {
                    "type": "string"
                },
                "PDecimals": {
                    "type": "integer"
                },
                "Decimals": {
                    "type": "integer"
                },
                "ContractID": {
                    "type": "string"
                },
                "Status": {
                    "type": "integer"
                },
                "Type": {
                    "type": "integer"
                },
                "CurrencyType": {
                    "type": "integer"
                },
                "Default": {
                    "type": "boolean"
                },
                "Verified": {
                    "type": "boolean"
                },
                "UserID": {
                    "type": "integer"
                },
                "ListChildToken": {
                    "anyOf": [{
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/Result"
                            }
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "ListUnifiedToken": {
                    "anyOf": [{
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/Result"
                            }
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "PSymbol": {
                    "type": "string"
                },
                "OriginalSymbol": {
                    "type": "string"
                },
                "LiquidityReward": {
                    "type": "number"
                },
                "ExternalPriceUSD": {
                    "type": "number"
                },
                "PriceUsd": {
                    "type": "number"
                },
                "PercentChange1h": {
                    "type": "string"
                },
                "PercentChangePrv1h": {
                    "type": "string"
                },
                "PercentChange24h": {
                    "type": "string"
                },
                "CurrentPrvPool": {
                    "type": "integer"
                },
                "PricePrv": {
                    "type": "number"
                },
                "volume24": {
                    "type": "integer"
                },
                "ParentID": {
                    "type": "integer"
                },
                "Network": {
                    "type": "string"
                },
                "DefaultPoolPair": {
                    "type": "string"
                },
                "DefaultPairToken": {
                    "type": "string"
                },
                "NetworkID": {
                    "type": "integer"
                },
                "MovedUnifiedToken": {
                    "type": "boolean"
                },
                "ParentUnifiedID": {
                    "type": "integer"
                }
            },
            "required": [
                "ContractID",
                "CurrencyType",
                "CurrentPrvPool",
                "Decimals",
                "Default",
                "DefaultPairToken",
                "DefaultPoolPair",
                "ExternalID",
                "ExternalPriceUSD",
                "Image",
                "IsBridge",
                "IsPrivacy",
                "LiquidityReward",
                "ListChildToken",
                "ListUnifiedToken",
                "MovedUnifiedToken",
                "Name",
                "Network",
                "NetworkID",
                "OriginalSymbol",
                "PDecimals",
                "PSymbol",
                "ParentID",
                "ParentUnifiedID",
                "PercentChange1h",
                "PercentChange24h",
                "PercentChangePrv1h",
                "PricePrv",
                "PriceUsd",
                "Status",
                "Symbol",
                "TokenID",
                "Type",
                "UserID",
                "Verified",
                "volume24"
            ],
            "title": "Result"
        },
    }
};

const getLitsPoolSchemas = {
    "$id": "litsPoolSchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome1",
    "definitions": {
        "Welcome1": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Result": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Result"
                    }
                },
                "Error": {
                    "type": "null"
                }
            },
            "required": [
                "Error",
                "Result"
            ],
            "title": "Welcome1"
        },
        "Result": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "PoolID": {
                    "type": "string"
                },
                "Token1ID": {
                    "type": "string"
                },
                "Token2ID": {
                    "type": "string"
                },
                "Token1Value": {
                    "type": "integer"
                },
                "Token2Value": {
                    "type": "integer"
                },
                "Virtual1Value": {
                    "type": "integer"
                },
                "Virtual2Value": {
                    "type": "integer"
                },
                "TotalShare": {
                    "type": "integer"
                },
                "AMP": {
                    "type": "integer"
                },
                "Price": {
                    "type": "number"
                },
                "Volume": {
                    "type": "number"
                },
                "PriceChange24h": {
                    "type": "number"
                },
                "APY": {
                    "type": "integer"
                },
                "IsVerify": {
                    "type": "boolean"
                }
            },
            "required": [
                "AMP",
                "APY",
                "IsVerify",
                "PoolID",
                "Price",
                "PriceChange24h",
                "Token1ID",
                "Token1Value",
                "Token2ID",
                "Token2Value",
                "TotalShare",
                "Virtual1Value",
                "Virtual2Value",
                "Volume"
            ],
            "title": "Result"
        }
    }
};

const getLitsPairSchemas = {
    "$id": "litsPairSchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome6",
    "definitions": {
        "Welcome6": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Result": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Result"
                    }
                },
                "Error": {
                    "type": "null"
                }
            },
            "required": [
                "Error",
                "Result"
            ],
            "title": "Welcome6"
        },
        "Result": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "PairID": {
                    "type": "string"
                },
                "TokenID1": {
                    "type": "string"
                },
                "TokenID2": {
                    "type": "string"
                },
                "Token1Amount": {
                    "type": "integer"
                },
                "Token2Amount": {
                    "type": "integer"
                },
                "PoolCount": {
                    "type": "integer"
                }
            },
            "required": [
                "PairID",
                "PoolCount",
                "Token1Amount",
                "Token2Amount",
                "TokenID1",
                "TokenID2"
            ],
            "title": "Result"
        }
    }
};

const getTradeHistorySchemas = {
    "$id": "TradeHistorySchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome1",
    "definitions": {
        "Welcome1": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Result": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Result"
                    }
                },
                "Error": {
                    "type": "null"
                }
            },
            "required": [
                "Error",
                "Result"
            ],
            "title": "Welcome1"
        },
        "Result": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "RequestTx": {
                    "type": "string"
                },
                "RespondTxs": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "RespondTokens": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "RespondAmounts": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "WithdrawTxs": {
                    "type": "null"
                },
                "SellTokenID": {
                    "type": "string"
                },
                "BuyTokenID": {
                    "type": "string"
                },
                "Status": {
                    "type": "string"
                },
                "StatusCode": {
                    "type": "integer"
                },
                "PairID": {
                    "type": "string"
                },
                "PoolID": {
                    "type": "string"
                },
                "MinAccept": {
                    "type": "integer"
                },
                "Amount": {
                    "type": "integer"
                },
                "Matched": {
                    "type": "integer"
                },
                "Requestime": {
                    "type": "integer"
                },
                "NFTID": {
                    "type": "string"
                },
                "Receiver": {
                    "type": "string"
                },
                "Fee": {
                    "type": "integer"
                },
                "FeeToken": {
                    "type": "string"
                },
                "IsCompleted": {
                    "type": "boolean"
                },
                "SellTokenBalance": {
                    "type": "integer"
                },
                "BuyTokenBalance": {
                    "type": "integer"
                },
                "SellTokenWithdrawed": {
                    "type": "integer"
                },
                "BuyTokenWithdrawed": {
                    "type": "integer"
                },
                "TradingPath": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            },
            "required": [
                "Amount",
                "BuyTokenBalance",
                "BuyTokenID",
                "BuyTokenWithdrawed",
                "Fee",
                "FeeToken",
                "IsCompleted",
                "Matched",
                "MinAccept",
                "NFTID",
                "PairID",
                "PoolID",
                "Receiver",
                "RequestTx",
                "Requestime",
                "RespondAmounts",
                "RespondTokens",
                "RespondTxs",
                "SellTokenBalance",
                "SellTokenID",
                "SellTokenWithdrawed",
                "Status",
                "StatusCode",
                "TradingPath",
                "WithdrawTxs"
            ],
            "title": "Result"
        }
    }
};

const getEstimatetradeSchemas = {
    "$id": "EstimatetradeSchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome4",
    "definitions": {
        "Welcome4": {
            "type": "object",
            "additionalProperties": false,
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
            "title": "Welcome4"
        },
        "Result": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "FeePRV": {
                    "$ref": "#/definitions/Fee"
                },
                "FeeToken": {
                    "$ref": "#/definitions/Fee"
                }
            },
            "required": [
                "FeePRV",
                "FeeToken"
            ],
            "title": "Result"
        },
        "Fee": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "SellAmount": {
                    "type": "integer"
                },
                "MaxGet": {
                    "type": "integer"
                },
                "Fee": {
                    "type": "integer"
                },
                "Route": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "TokenRoute": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "IsSignificant": {
                    "type": "boolean"
                },
                "ImpactAmount": {
                    "type": "number"
                }
            },
            "required": [
                "Fee",
                "ImpactAmount",
                "IsSignificant",
                "MaxGet",
                "Route",
                "SellAmount",
                "TokenRoute"
            ],
            "title": "Fee"
        }
    }
};

const getGetKeyInfoSchemas = {
    "$id": "GetKeyInfoSchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome6",
    "definitions": {
        "Welcome6": {
            "type": "object",
            "additionalProperties": false,
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
            "title": "Welcome6"
        },
        "Result": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "id": {
                    "type": "string"
                },
                "created_at": {
                    "type": "string",
                },
                "updated_at": {
                    "type": "string",
                },
                "pubkey": {
                    "type": "string"
                },
                "otakey": {
                    "type": "string"
                },
                "coinindex": {
                    "type": "object",
                    "additionalProperties": {
                        "$ref": "#/definitions/Index"
                    }
                },
                "nftindex": {
                    "type": "object",
                    "additionalProperties": {
                        "$ref": "#/definitions/Index"
                    }
                },
                "receivetxs": {
                    "type": "object",
                    "additionalProperties": {
                        "type": "integer"
                    }
                },
                "lastscantxid": {
                    "type": "string"
                }
            },
            "required": [
                "coinindex",
                "created_at",
                "id",
                "lastscantxid",
                "nftindex",
                "otakey",
                "pubkey",
                "receivetxs",
                "updated_at"
            ],
            "title": "Result"
        },
        "Index": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Start": {
                    "type": "integer"
                },
                "Total": {
                    "type": "integer"
                },
                "End": {
                    "type": "integer"
                },
                "LastScanned": {
                    "type": "integer"
                }
            },
            "required": [
                "End",
                "LastScanned",
                "Start",
                "Total"
            ],
            "title": "Index"
        }
    }
};

const getCheckKeyImageSchemas = {
    "$id": "CheckKeyImageSchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome9",
    "definitions": {
        "Welcome9": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Result": {
                    "type": "array",
                    "items": {
                        "type": "boolean"
                    }
                },
                "Error": {
                    "type": "null"
                }
            },
            "required": [
                "Error",
                "Result"
            ],
            "title": "Welcome9"
        }
    }
};

const getTokenInfoSchemas = {
    "$id": "TokenInfoSchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome4",
    "definitions": {
        "Welcome4": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Result": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Result"
                    }
                },
                "Error": {
                    "type": "null"
                }
            },
            "required": [
                "Error",
                "Result"
            ],
            "title": "Welcome4"
        },
        "Result": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "TokenID": {
                    "type": "string"
                },
                "Name": {
                    "type": "string"
                },
                "Symbol": {
                    "type": "string"
                },
                "Image": {
                    "type": "string"
                },
                "IsPrivacy": {
                    "type": "boolean"
                },
                "IsBridge": {
                    "type": "boolean"
                },
                "ExternalID": {
                    "type": "string"
                },
                "PDecimals": {
                    "type": "integer"
                },
                "Decimals": {
                    "type": "integer"
                },
                "ContractID": {
                    "type": "string"
                },
                "Status": {
                    "type": "integer"
                },
                "Type": {
                    "type": "integer"
                },
                "CurrencyType": {
                    "type": "integer"
                },
                "Default": {
                    "type": "boolean"
                },
                "Verified": {
                    "type": "boolean"
                },
                "UserID": {
                    "type": "integer"
                },
                "ListChildToken": {
                    "anyOf": [{
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/Result"
                            }
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "ListUnifiedToken": {
                    "anyOf": [{
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/Result"
                            }
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "PSymbol": {
                    "type": "string"
                },
                "OriginalSymbol": {
                    "type": "string"
                },
                "LiquidityReward": {
                    "type": "number"
                },
                "ExternalPriceUSD": {
                    "type": "number"
                },
                "PriceUsd": {
                    "type": "number"
                },
                "PercentChange1h": {
                    "type": "string"
                },
                "PercentChangePrv1h": {
                    "type": "string"
                },
                "PercentChange24h": {
                    "type": "string"
                },
                "CurrentPrvPool": {
                    "type": "integer"
                },
                "PricePrv": {
                    "type": "number"
                },
                "volume24": {
                    "type": "integer"
                },
                "ParentID": {
                    "type": "integer"
                },
                "Network": {
                    "type": "string"
                },
                "DefaultPoolPair": {
                    "type": "string"
                },
                "DefaultPairToken": {
                    "$ref": "#/definitions/DefaultPairToken"
                },
                "NetworkID": {
                    "type": "integer"
                },
                "MovedUnifiedToken": {
                    "type": "boolean"
                },
                "ParentUnifiedID": {
                    "type": "integer"
                }
            },
            "required": [
                "ContractID",
                "CurrencyType",
                "CurrentPrvPool",
                "Decimals",
                "Default",
                "DefaultPairToken",
                "DefaultPoolPair",
                "ExternalID",
                "ExternalPriceUSD",
                "Image",
                "IsBridge",
                "IsPrivacy",
                "LiquidityReward",
                "ListChildToken",
                "ListUnifiedToken",
                "MovedUnifiedToken",
                "Name",
                "Network",
                "NetworkID",
                "OriginalSymbol",
                "PDecimals",
                "PSymbol",
                "ParentID",
                "ParentUnifiedID",
                "PercentChange1h",
                "PercentChange24h",
                "PercentChangePrv1h",
                "PricePrv",
                "PriceUsd",
                "Status",
                "Symbol",
                "TokenID",
                "Type",
                "UserID",
                "Verified",
                "volume24"
            ],
            "title": "Result"
        },
        "DefaultPairToken": {
            "type": "string",
            "enum": [
                "076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229",
                "0000000000000000000000000000000000000000000000000000000000000004",
                ""
            ],
            "title": "DefaultPairToken"
        }
    }
};

const getPendingOrderSchemas = {
    "$id": "PendingOrderSchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome1",
    "definitions": {
        "Welcome1": {
            "type": "object",
            "additionalProperties": false,
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
            "title": "Welcome1"
        },
        "Result": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Buy": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Buy"
                    }
                },
                "Sell": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Buy"
                    }
                }
            },
            "required": [
                "Buy",
                "Sell"
            ],
            "title": "Result"
        },
        "Buy": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "TxRequest": {
                    "type": "string"
                },
                "Token1Amount": {
                    "type": "integer"
                },
                "Token2Amount": {
                    "type": "integer"
                },
                "Token1Remain": {
                    "type": "integer"
                },
                "Token2Remain": {
                    "type": "integer"
                },
                "Rate": {
                    "type": "number"
                }
            },
            "required": [
                "Rate",
                "Token1Amount",
                "Token1Remain",
                "Token2Amount",
                "Token2Remain",
                "TxRequest"
            ],
            "title": "Buy"
        }
    }
};

const getPendingLimitSchemas = {
    "$id": "PendingLimitSchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome1",
    "definitions": {
        "Welcome1": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Result": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Result"
                    }
                },
                "Error": {
                    "type": "null"
                }
            },
            "required": [
                "Error",
                "Result"
            ],
            "title": "Welcome1"
        },
        "Result": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "RequestTx": {
                    "type": "string"
                },
                "RespondTxs": {
                    "type": "array",
                    "items": {}
                },
                "RespondTokens": {
                    "type": "array",
                    "items": {}
                },
                "RespondAmounts": {
                    "type": "array",
                    "items": {}
                },
                "WithdrawTxs": {
                    "$ref": "#/definitions/WithdrawTxs"
                },
                "SellTokenID": {
                    "type": "string"
                },
                "BuyTokenID": {
                    "type": "string"
                },
                "Status": {
                    "type": "string"
                },
                "StatusCode": {
                    "type": "integer"
                },
                "PairID": {
                    "type": "string"
                },
                "PoolID": {
                    "type": "string"
                },
                "MinAccept": {
                    "type": "integer"
                },
                "Amount": {
                    "type": "integer"
                },
                "Matched": {
                    "type": "integer"
                },
                "Requestime": {
                    "type": "integer"
                },
                "NFTID": {
                    "type": "string"
                },
                "Receiver": {
                    "type": "string"
                },
                "Fee": {
                    "type": "integer"
                },
                "FeeToken": {
                    "type": "string"
                },
                "IsCompleted": {
                    "type": "boolean"
                },
                "SellTokenBalance": {
                    "type": "integer"
                },
                "BuyTokenBalance": {
                    "type": "integer"
                },
                "SellTokenWithdrawed": {
                    "type": "integer"
                },
                "BuyTokenWithdrawed": {
                    "type": "integer"
                },
                "TradingPath": {
                    "type": "null"
                }
            },
            "required": [
                "Amount",
                "BuyTokenBalance",
                "BuyTokenID",
                "BuyTokenWithdrawed",
                "Fee",
                "FeeToken",
                "IsCompleted",
                "Matched",
                "MinAccept",
                "NFTID",
                "PairID",
                "PoolID",
                "Receiver",
                "RequestTx",
                "Requestime",
                "RespondAmounts",
                "RespondTokens",
                "RespondTxs",
                "SellTokenBalance",
                "SellTokenID",
                "SellTokenWithdrawed",
                "Status",
                "StatusCode",
                "TradingPath",
                "WithdrawTxs"
            ],
            "title": "Result"
        },
        "WithdrawTxs": {
            "type": "object",
            "additionalProperties": true,
            "title": "WithdrawTxs"
        }
    }
};

const getOrderTradeHistorySchemas = {
    "$id": "OrderTradeHistorySchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome9",
    "definitions": {
        "Welcome9": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Result": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Result"
                    }
                },
                "Error": {
                    "type": "null"
                }
            },
            "required": [
                "Error",
                "Result"
            ],
            "title": "Welcome9"
        },
        "Result": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "RequestTx": {
                    "type": "string"
                },
                "RespondTxs": {
                    "type": "array",
                    "items": {}
                },
                "RespondTokens": {
                    "type": "array",
                    "items": {}
                },
                "RespondAmounts": {
                    "type": "array",
                    "items": {}
                },
                "WithdrawTxs": {
                    "$ref": "#/definitions/WithdrawTxs"
                },
                "SellTokenID": {
                    "type": "string"
                },
                "BuyTokenID": {
                    "type": "string"
                },
                "Status": {
                    "type": "string"
                },
                "StatusCode": {
                    "type": "integer"
                },
                "PairID": {
                    "type": "string"
                },
                "PoolID": {
                    "type": "string"
                },
                "MinAccept": {
                    "type": "integer"
                },
                "Amount": {
                    "type": "integer"
                },
                "Matched": {
                    "type": "integer"
                },
                "Requestime": {
                    "type": "integer"
                },
                "NFTID": {
                    "type": "string"
                },
                "Receiver": {
                    "type": "string"
                },
                "Fee": {
                    "type": "integer"
                },
                "FeeToken": {
                    "type": "string"
                },
                "IsCompleted": {
                    "type": "boolean"
                },
                "SellTokenBalance": {
                    "type": "integer"
                },
                "BuyTokenBalance": {
                    "type": "integer"
                },
                "SellTokenWithdrawed": {
                    "type": "integer"
                },
                "BuyTokenWithdrawed": {
                    "type": "integer"
                },
                "TradingPath": {
                    "type": "null"
                }
            },
            "required": [
                "Amount",
                "BuyTokenBalance",
                "BuyTokenID",
                "BuyTokenWithdrawed",
                "Fee",
                "FeeToken",
                "IsCompleted",
                "Matched",
                "MinAccept",
                "NFTID",
                "PairID",
                "PoolID",
                "Receiver",
                "RequestTx",
                "Requestime",
                "RespondAmounts",
                "RespondTokens",
                "RespondTxs",
                "SellTokenBalance",
                "SellTokenID",
                "SellTokenWithdrawed",
                "Status",
                "StatusCode",
                "TradingPath",
                "WithdrawTxs"
            ],
            "title": "Result"
        },
        "WithdrawTxs": {
            "type": "object",
            "additionalProperties": true,
            "title": "WithdrawTxs"
        }
    }
};

const getPoolShareSchemas = {
    "$id": "PoolShareSchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome2",
    "definitions": {
        "Welcome2": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Result": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Result"
                    }
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
            "additionalProperties": false,
            "properties": {
                "PoolID": {
                    "type": "string"
                },
                "TokenID1": {
                    "type": "string"
                },
                "TokenID2": {
                    "type": "string"
                },
                "Token1Amount": {
                    "type": "integer"
                },
                "Token2Amount": {
                    "type": "integer"
                },
                "Rewards": {
                    "type": "object",
                    "additionalProperties": {
                        "type": "integer"
                    }
                },
                "OrderRewards": {
                    "$ref": "#/definitions/OrderRewards"
                },
                "Share": {
                    "type": "integer"
                },
                "AMP": {
                    "type": "integer"
                },
                "TotalShare": {
                    "type": "integer"
                }
            },
            "required": [
                "AMP",
                "OrderRewards",
                "PoolID",
                "Rewards",
                "Share",
                "Token1Amount",
                "Token2Amount",
                "TokenID1",
                "TokenID2",
                "TotalShare"
            ],
            "title": "Result"
        },
        "OrderRewards": {
            "type": "object",
            "additionalProperties": false,
            "title": "OrderRewards"
        }
    }
};

const getPoolDetailSchemas = {
    "$id": "PoolDetailSchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome7",
    "definitions": {
        "Welcome7": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Result": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Result"
                    }
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
            "additionalProperties": false,
            "properties": {
                "PoolID": {
                    "type": "string"
                },
                "Token1ID": {
                    "type": "string"
                },
                "Token2ID": {
                    "type": "string"
                },
                "Token1Value": {
                    "type": "integer"
                },
                "Token2Value": {
                    "type": "integer"
                },
                "Virtual1Value": {
                    "type": "integer"
                },
                "Virtual2Value": {
                    "type": "integer"
                },
                "TotalShare": {
                    "type": "integer"
                },
                "AMP": {
                    "type": "integer"
                },
                "Price": {
                    "type": "number"
                },
                "Volume": {
                    "type": "number"
                },
                "PriceChange24h": {
                    "type": "number"
                },
                "APY": {
                    "type": "integer"
                },
                "IsVerify": {
                    "type": "boolean"
                }
            },
            "required": [
                "AMP",
                "APY",
                "IsVerify",
                "PoolID",
                "Price",
                "PriceChange24h",
                "Token1ID",
                "Token1Value",
                "Token2ID",
                "Token2Value",
                "TotalShare",
                "Virtual1Value",
                "Virtual2Value",
                "Volume"
            ],
            "title": "Result"
        }
    }
};

const getContributeHistorySchemas = {
    "$id": "ContributeHistorySchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome8",
    "definitions": {
        "Welcome8": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Result": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Result"
                    }
                },
                "Error": {
                    "type": "null"
                }
            },
            "required": [
                "Error",
                "Result"
            ],
            "title": "Welcome8"
        },
        "Result": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "RequestTxs": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "RespondTxs": {
                    "anyOf": [{
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "PairID": {
                    "type": "string"
                },
                "PoolID": {
                    "type": "string"
                },
                "PairHash": {
                    "type": "string"
                },
                "ContributeTokens": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "ContributeAmount": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "ReturnTokens": {
                    "anyOf": [{
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "ReturnAmount": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "NFTID": {
                    "type": "string"
                },
                "RequestTime": {
                    "type": "integer"
                },
                "Status": {
                    "type": "string"
                }
            },
            "required": [
                "ContributeAmount",
                "ContributeTokens",
                "NFTID",
                "PairHash",
                "PairID",
                "PoolID",
                "RequestTime",
                "RequestTxs",
                "RespondTxs",
                "ReturnAmount",
                "ReturnTokens",
                "Status"
            ],
            "title": "Result"
        }
    }
};

const getWithdrawHistorySchemas = {
    "$id": "WithdrawHistorySchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome2",
    "definitions": {
        "Welcome2": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Result": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Result"
                    }
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
            "additionalProperties": false,
            "properties": {
                "PoolID": {
                    "type": "string"
                },
                "RequestTx": {
                    "type": "string"
                },
                "RespondTxs": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "Status": {
                    "type": "integer"
                },
                "TokenID1": {
                    "type": "string"
                },
                "TokenID2": {
                    "type": "string"
                },
                "Amount1": {
                    "type": "integer"
                },
                "Amount2": {
                    "type": "integer"
                },
                "ShareAmount": {
                    "type": "integer"
                },
                "Requestime": {
                    "type": "integer"
                }
            },
            "required": [
                "Amount1",
                "Amount2",
                "PoolID",
                "RequestTx",
                "Requestime",
                "RespondTxs",
                "ShareAmount",
                "Status",
                "TokenID1",
                "TokenID2"
            ],
            "title": "Result"
        }
    }
};

const getWithdrawFeeHistorySchemas = {
    "$id": "WithdrawFeeHistorySchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome5",
    "definitions": {
        "Welcome5": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Result": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Result"
                    }
                },
                "Error": {
                    "type": "null"
                }
            },
            "required": [
                "Error",
                "Result"
            ],
            "title": "Welcome5"
        },
        "Result": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "PoolID": {
                    "type": "string"
                },
                "RequestTx": {
                    "type": "string"
                },
                "RespondTxs": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "Status": {
                    "type": "integer"
                },
                "WithdrawTokens": {
                    "type": "object",
                    "additionalProperties": {
                        "type": "integer"
                    }
                },
                "Requestime": {
                    "type": "integer"
                }
            },
            "required": [
                "PoolID",
                "RequestTx",
                "Requestime",
                "RespondTxs",
                "Status",
                "WithdrawTokens"
            ],
            "title": "Result"
        }
    }
};

const getTxBySenderSchemas = {
    "$id": "TxBySenderSchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome3",
    "definitions": {
        "Welcome3": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Result": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Result"
                    }
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
            "additionalProperties": false,
            "properties": {
                "TxDetail": {
                    "$ref": "#/definitions/TxDetail"
                },
                "FromShardID": {
                    "type": "integer"
                }
            },
            "required": [
                "FromShardID",
                "TxDetail"
            ],
            "title": "Result"
        },
        "TxDetail": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "BlockHash": {
                    "type": "string"
                },
                "BlockHeight": {
                    "type": "integer"
                },
                "TxSize": {
                    "type": "integer"
                },
                "Index": {
                    "type": "integer"
                },
                "ShardID": {
                    "type": "integer"
                },
                "Hash": {
                    "type": "string"
                },
                "Version": {
                    "type": "integer"
                },
                "Type": {
                    "type": "string"
                },
                "LockTime": {
                    "type": "string",

                },
                "Fee": {
                    "type": "integer"
                },
                "Image": {
                    "type": "string"
                },
                "IsPrivacy": {
                    "type": "boolean"
                },
                "Proof": {
                    "type": "null"
                },
                "ProofDetail": {
                    "$ref": "#/definitions/ProofDetail"
                },
                "InputCoinPubKey": {
                    "type": "string"
                },
                "OutputCoinPubKey": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "OutputCoinSND": {
                    "type": "null"
                },
                "TokenInputCoinPubKey": {
                    "type": "string"
                },
                "TokenOutputCoinPubKey": {
                    "anyOf": [{
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "TokenOutputCoinSND": {
                    "type": "null"
                },
                "SigPubKey": {
                    "type": "string"
                },
                "Metatype": {
                    "type": "integer"
                },
                "Metadata": {
                    "type": "string"
                },
                "CustomTokenData": {
                    "type": "string"
                },
                "PrivacyCustomTokenID": {
                    "type": "string"
                },
                "PrivacyCustomTokenName": {
                    "type": "string"
                },
                "PrivacyCustomTokenSymbol": {
                    "type": "string"
                },
                "PrivacyCustomTokenData": {
                    "type": "string"
                },
                "PrivacyCustomTokenProofDetail": {
                    "$ref": "#/definitions/ProofDetail"
                },
                "PrivacyCustomTokenIsPrivacy": {
                    "type": "boolean"
                },
                "PrivacyCustomTokenFee": {
                    "type": "integer"
                },
                "IsInMempool": {
                    "type": "boolean"
                },
                "IsInBlock": {
                    "type": "boolean"
                },
                "Info": {
                    "type": "string"
                }
            },
            "required": [
                "BlockHash",
                "BlockHeight",
                "CustomTokenData",
                "Fee",
                "Hash",
                "Image",
                "Index",
                "Info",
                "InputCoinPubKey",
                "IsInBlock",
                "IsInMempool",
                "IsPrivacy",
                "LockTime",
                "Metadata",
                "Metatype",
                "OutputCoinPubKey",
                "OutputCoinSND",
                "PrivacyCustomTokenData",
                "PrivacyCustomTokenFee",
                "PrivacyCustomTokenID",
                "PrivacyCustomTokenIsPrivacy",
                "PrivacyCustomTokenName",
                "PrivacyCustomTokenProofDetail",
                "PrivacyCustomTokenSymbol",
                "Proof",
                "ProofDetail",
                "ShardID",
                "SigPubKey",
                "TokenInputCoinPubKey",
                "TokenOutputCoinPubKey",
                "TokenOutputCoinSND",
                "TxSize",
                "Type",
                "Version"
            ],
            "title": "TxDetail"
        },
        "ProofDetail": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "InputCoins": {
                    "anyOf": [{
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/PutCoin"
                            }
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "OutputCoins": {
                    "anyOf": [{
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/PutCoin"
                            }
                        },
                        {
                            "type": "null"
                        }
                    ]
                }
            },
            "required": [
                "InputCoins",
                "OutputCoins"
            ],
            "title": "ProofDetail"
        },
        "PutCoin": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Version": {
                    "type": "integer"
                },
                "Index": {
                    "type": "integer"
                },
                "Info": {
                    "type": "string"
                },
                "PublicKey": {
                    "type": "string"
                },
                "Commitment": {
                    "type": "string"
                },
                "KeyImage": {
                    "type": "string"
                },
                "TxRandom": {
                    "type": "string"
                },
                "Value": {
                    "type": "string",

                },
                "Randomness": {
                    "type": "string"
                }
            },
            "required": [
                "Commitment",
                "Index",
                "Info",
                "KeyImage",
                "PublicKey",
                "Randomness",
                "TxRandom",
                "Value",
                "Version"
            ],
            "title": "PutCoin"
        }
    }
};

const getTxByPubKeySchemas = {
    "$id": "TxBySenderSchemas",
    "type": "object",
    "$ref": "#/definitions/Welcome10",
    "definitions": {
        "Welcome10": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Result": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Result"
                    }
                },
                "Error": {
                    "type": "null"
                }
            },
            "required": [
                "Error",
                "Result"
            ],
            "title": "Welcome10"
        },
        "Result": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "TxDetail": {
                    "$ref": "#/definitions/TxDetail"
                },
                "FromShardID": {
                    "type": "integer"
                }
            },
            "required": [
                "FromShardID",
                "TxDetail"
            ],
            "title": "Result"
        },
        "TxDetail": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "BlockHash": {
                    "type": "string"
                },
                "BlockHeight": {
                    "type": "integer"
                },
                "TxSize": {
                    "type": "integer"
                },
                "Index": {
                    "type": "integer"
                },
                "ShardID": {
                    "type": "integer"
                },
                "Hash": {
                    "type": "string"
                },
                "Version": {
                    "type": "integer"
                },
                "Type": {
                    "type": "string"
                },
                "LockTime": {
                    "type": "string",

                },
                "Fee": {
                    "type": "integer"
                },
                "Image": {
                    "type": "string"
                },
                "IsPrivacy": {
                    "type": "boolean"
                },
                "Proof": {
                    "type": "null"
                },
                "ProofDetail": {
                    "$ref": "#/definitions/ProofDetail"
                },
                "InputCoinPubKey": {
                    "type": "string"
                },
                "OutputCoinPubKey": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "OutputCoinSND": {
                    "type": "null"
                },
                "TokenInputCoinPubKey": {
                    "type": "string"
                },
                "TokenOutputCoinPubKey": {
                    "anyOf": [{
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "TokenOutputCoinSND": {
                    "type": "null"
                },
                "SigPubKey": {
                    "type": "string"
                },
                "Metatype": {
                    "type": "integer"
                },
                "Metadata": {
                    "type": "string"
                },
                "CustomTokenData": {
                    "type": "string"
                },
                "PrivacyCustomTokenID": {
                    "type": "string"
                },
                "PrivacyCustomTokenName": {
                    "type": "string"
                },
                "PrivacyCustomTokenSymbol": {
                    "type": "string"
                },
                "PrivacyCustomTokenData": {
                    "type": "string"
                },
                "PrivacyCustomTokenProofDetail": {
                    "$ref": "#/definitions/ProofDetail"
                },
                "PrivacyCustomTokenIsPrivacy": {
                    "type": "boolean"
                },
                "PrivacyCustomTokenFee": {
                    "type": "integer"
                },
                "IsInMempool": {
                    "type": "boolean"
                },
                "IsInBlock": {
                    "type": "boolean"
                },
                "Info": {
                    "type": "string"
                }
            },
            "required": [
                "BlockHash",
                "BlockHeight",
                "CustomTokenData",
                "Fee",
                "Hash",
                "Image",
                "Index",
                "Info",
                "InputCoinPubKey",
                "IsInBlock",
                "IsInMempool",
                "IsPrivacy",
                "LockTime",
                "Metadata",
                "Metatype",
                "OutputCoinPubKey",
                "OutputCoinSND",
                "PrivacyCustomTokenData",
                "PrivacyCustomTokenFee",
                "PrivacyCustomTokenID",
                "PrivacyCustomTokenIsPrivacy",
                "PrivacyCustomTokenName",
                "PrivacyCustomTokenProofDetail",
                "PrivacyCustomTokenSymbol",
                "Proof",
                "ProofDetail",
                "ShardID",
                "SigPubKey",
                "TokenInputCoinPubKey",
                "TokenOutputCoinPubKey",
                "TokenOutputCoinSND",
                "TxSize",
                "Type",
                "Version"
            ],
            "title": "TxDetail"
        },
        "ProofDetail": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "InputCoins": {
                    "anyOf": [{
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/PutCoin"
                            }
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "OutputCoins": {
                    "anyOf": [{
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/PutCoin"
                            }
                        },
                        {
                            "type": "null"
                        }
                    ]
                }
            },
            "required": [
                "InputCoins",
                "OutputCoins"
            ],
            "title": "ProofDetail"
        },
        "PutCoin": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Version": {
                    "type": "integer"
                },
                "Index": {
                    "type": "integer"
                },
                "Info": {
                    "type": "string"
                },
                "PublicKey": {
                    "type": "string"
                },
                "Commitment": {
                    "type": "string"
                },
                "KeyImage": {
                    "type": "string"
                },
                "TxRandom": {
                    "type": "string"
                },
                "Value": {
                    "type": "string",

                },
                "Randomness": {
                    "type": "string"
                }
            },
            "required": [
                "Commitment",
                "Index",
                "Info",
                "KeyImage",
                "PublicKey",
                "Randomness",
                "TxRandom",
                "Value",
                "Version"
            ],
            "title": "PutCoin"
        }
    }
};

module.exports = {
    getTokenListSchemas,
    getLitsPoolSchemas,
    getLitsPairSchemas,
    getTradeHistorySchemas,
    getEstimatetradeSchemas,
    getGetKeyInfoSchemas,
    getCheckKeyImageSchemas,
    getTokenInfoSchemas,
    getPendingOrderSchemas,
    getPendingLimitSchemas,
    getOrderTradeHistorySchemas,
    getPoolShareSchemas,
    getPoolDetailSchemas,
    getContributeHistorySchemas,
    getWithdrawHistorySchemas,
    getWithdrawFeeHistorySchemas,
    getTxBySenderSchemas,
    getTxByPubKeySchemas
};