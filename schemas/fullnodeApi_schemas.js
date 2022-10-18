export const getGenerateportalshieldmultisigaddressSchemas = {
    "$id": "generateportalshieldmultisigaddressSchemas",
    "type": "object",
    "properties": {
        "Id": {
            "type": "integer"
        },
        "Result": {
            "type": "string"
        },
        "Error": {
            "type": "null"
        },
        "Params": {
            "type": "array",
            "items": [{
                "type": "object",
                "properties": {
                    "IncAddressStr": {
                        "type": "string"
                    },
                    "TokenID": {
                        "type": "string"
                    }
                },
                "required": [
                    "IncAddressStr",
                    "TokenID"
                ]
            }]
        },
        "Method": {
            "type": "string"
        },
        "Jsonrpc": {
            "type": "string"
        }
    },
    "required": [
        "Id",
        "Result",
        "Error",
        "Params",
        "Method",
        "Jsonrpc"
    ]
};