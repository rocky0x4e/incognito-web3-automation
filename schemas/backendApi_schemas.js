export const getOtaGenerateSchemas = {
    "$id": "otaGenerateSchemas",
    "type": "object",
    "properties": {
        "Result": {
            "type": "object",
            "properties": {
                "ID": {
                    "type": "integer"
                },
                "Address": {
                    "type": "string"
                },
                "ExpiredAt": {
                    "type": "string"
                },
                "EstimateFee": {
                    "type": "integer"
                },
                "TokenFee": {
                    "type": "integer"
                },
                "Decentralized": {
                    "type": "integer"
                }
            },
            "required": [
                "ID",
                "Address",
                "ExpiredAt",
                "EstimateFee",
                "TokenFee",
                "Decentralized"
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