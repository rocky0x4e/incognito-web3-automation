export const getGenShieldAddressSchemas = {
    "$id": "genShieldAddressSchemas",
    "type": "object",
    "properties": {
        "Result": {
            "type": "object",
            "properties": {
                "Address": {
                    "type": "string"
                },
                "Decentralized": {
                    "type": "integer"
                },
                "EstimateFee": {
                    "type": "integer"
                },
                "ExpiredAt": {
                    "type": "string"
                },
                "ID": {
                    "type": "integer"
                },
                "TokenFee": {
                    "type": "integer"
                }
            },
            "required": [
                "Address",
                "Decentralized",
                "EstimateFee",
                "ExpiredAt",
                "ID",
                "TokenFee"
            ]
        },
        "Error": {
            "type": "null"
        }
    },
    "required": [
        "Result",
        "Error"
    ]
};


export const getGenShieldAddressBTCSchemas = {
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