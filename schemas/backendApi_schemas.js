 const getOtaGenerateSchemas = {
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

 const authenProfileSchemas = {
     "$id": "authenProfileSchemas",
     "type": "object",
     "$ref": "#/definitions/Welcome10",
     "definitions": {
         "Welcome10": {
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
             "title": "Welcome10"
         },
         "Result": {
             "type": "object",
             "additionalProperties": false,
             "properties": {
                 "ID": {
                     "type": "integer"
                 },
                 "UserName": {
                     "type": "string"
                 },
                 "FirstName": {
                     "type": "string"
                 },
                 "LastName": {
                     "type": "string"
                 },
                 "Email": {
                     "type": "string"
                 },
                 "PaymentAddress": {
                     "type": "string"
                 },
                 "Bio": {
                     "type": "string"
                 },
                 "Permissions": {
                     "type": "string"
                 },
                 "RoleID": {
                     "type": "integer"
                 }
             },
             "required": [
                 "Bio",
                 "Email",
                 "FirstName",
                 "ID",
                 "LastName",
                 "PaymentAddress",
                 "Permissions",
                 "RoleID",
                 "UserName"
             ],
             "title": "Result"
         }
     }
 };

 const disableFunctionConfigSchemas = {
     "$id": "authenProfileSchemas",
     "type": "object",
     "$ref": "#/definitions/Welcome3",
     "definitions": {
         "Welcome3": {
             "type": "object",
             "additionalProperties": false,
             "properties": {
                 "Result": {
                     "type": "object",
                     "additionalProperties": {
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
                 "ID": {
                     "type": "integer"
                 },
                 "CreatedAt": {
                     "type": "string",
                 },
                 "UpdatedAt": {
                     "type": "string",
                 },
                 "DeletedAt": {
                     "type": "null"
                 },
                 "Name": {
                     "type": "string"
                 },
                 "Descriptions": {
                     "type": "string"
                 },
                 "Disable": {
                     "type": "boolean"
                 },
                 "Message": {
                     "type": "string"
                 }
             },
             "required": [
                 "CreatedAt",
                 "DeletedAt",
                 "Descriptions",
                 "Disable",
                 "ID",
                 "Message",
                 "Name",
                 "UpdatedAt"
             ],
             "title": "Result"
         }
     }
 };

 const lastVersionSchemas = {
     "$id": "authenProfileSchemas",
     "type": "object",
     "$ref": "#/definitions/Welcome3",
     "definitions": {
         "Welcome3": {
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
             "title": "Welcome3"
         },
         "Result": {
             "type": "object",
             "additionalProperties": false,
             "properties": {
                 "Description": {
                     "type": "string"
                 },
                 "Version": {
                     "type": "string"
                 },
                 "Link": {
                     "type": "string",
                 },
                 "Platform": {
                     "type": "string"
                 },
                 "CreatedAt": {
                     "type": "string",
                 }
             },
             "required": [
                 "CreatedAt",
                 "Description",
                 "Link",
                 "Platform",
                 "Version"
             ],
             "title": "Result"
         }
     }
 };

 const tradeTokenSchemas = {
     "$id": "tradeTokenSchemas",
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
                 "ID": {
                     "type": "string"
                 },
                 "ContractID": {
                     "type": "string"
                 },
                 "ContractIDGetRate": {
                     "type": "string"
                 },
                 "Name": {
                     "type": "string"
                 },
                 "Symbol": {
                     "type": "string"
                 },
                 "Decimals": {
                     "type": "integer"
                 },
                 "PDecimals": {
                     "type": "integer"
                 },
                 "Protocol": {
                     "$ref": "#/definitions/Protocol"
                 },
                 "PricePrv": {
                     "type": "number"
                 },
                 "Verify": {
                     "type": "boolean"
                 },
                 "IsPopular": {
                     "type": "boolean"
                 },
                 "Priority": {
                     "type": "integer"
                 },
                 "DappID": {
                     "type": "integer"
                 },
                 "CurrencyType": {
                     "type": "integer"
                 },
                 "NetworkName": {
                     "type": "string"
                 },
                 "NetworkID": {
                     "type": "integer"
                 },
                 "MovedUnifiedToken": {
                     "type": "boolean"
                 }
             },
             "required": [
                 "ContractID",
                 "ContractIDGetRate",
                 "CurrencyType",
                 "DappID",
                 "Decimals",
                 "ID",
                 "IsPopular",
                 "MovedUnifiedToken",
                 "Name",
                 "NetworkID",
                 "NetworkName",
                 "PDecimals",
                 "PricePrv",
                 "Priority",
                 "Protocol",
                 "Symbol",
                 "Verify"
             ],
             "title": "Result"
         },
         "Protocol": {
             "type": "string",
             "enum": [
                 "pancake"
             ],
             "title": "Protocol"
         }
     }
 };

 const uniSwapTokenSchemas = {
     "$id": "uniSwapTokenSchemas",
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
                 "ID": {
                     "type": "string"
                 },
                 "ContractID": {
                     "type": "string"
                 },
                 "ContractIDGetRate": {
                     "type": "string"
                 },
                 "Name": {
                     "type": "string"
                 },
                 "Symbol": {
                     "type": "string"
                 },
                 "Decimals": {
                     "type": "integer"
                 },
                 "PDecimals": {
                     "type": "integer"
                 },
                 "Protocol": {
                     "$ref": "#/definitions/Protocol"
                 },
                 "PricePrv": {
                     "type": "number"
                 },
                 "Verify": {
                     "type": "boolean"
                 },
                 "IsPopular": {
                     "type": "boolean"
                 },
                 "Priority": {
                     "type": "integer"
                 },
                 "DappID": {
                     "type": "integer"
                 },
                 "CurrencyType": {
                     "type": "integer"
                 },
                 "NetworkName": {
                     "type": "string"
                 },
                 "NetworkID": {
                     "type": "integer"
                 },
                 "MovedUnifiedToken": {
                     "type": "boolean"
                 }
             },
             "required": [
                 "ContractID",
                 "ContractIDGetRate",
                 "CurrencyType",
                 "DappID",
                 "Decimals",
                 "ID",
                 "IsPopular",
                 "MovedUnifiedToken",
                 "Name",
                 "NetworkID",
                 "NetworkName",
                 "PDecimals",
                 "PricePrv",
                 "Priority",
                 "Protocol",
                 "Symbol",
                 "Verify"
             ],
             "title": "Result"
         },
         "Protocol": {
             "type": "string",
             "enum": [
                 "uniswap"
             ],
             "title": "Protocol"
         }
     }
 };

 const curveTokenSchemas = {
     "$id": "curveTokenSchemas",
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
                 "ID": {
                     "type": "string"
                 },
                 "ContractID": {
                     "type": "string"
                 },
                 "ContractIDGetRate": {
                     "type": "string"
                 },
                 "Name": {
                     "type": "string"
                 },
                 "Symbol": {
                     "type": "string"
                 },
                 "Decimals": {
                     "type": "integer"
                 },
                 "PDecimals": {
                     "type": "integer"
                 },
                 "Protocol": {
                     "type": "string"
                 },
                 "PricePrv": {
                     "type": "number"
                 },
                 "Verify": {
                     "type": "boolean"
                 },
                 "IsPopular": {
                     "type": "boolean"
                 },
                 "Priority": {
                     "type": "integer"
                 },
                 "DappID": {
                     "type": "integer"
                 },
                 "CurrencyType": {
                     "type": "integer"
                 },
                 "NetworkName": {
                     "type": "string"
                 },
                 "NetworkID": {
                     "type": "integer"
                 },
                 "MovedUnifiedToken": {
                     "type": "boolean"
                 }
             },
             "required": [
                 "ContractID",
                 "ContractIDGetRate",
                 "CurrencyType",
                 "DappID",
                 "Decimals",
                 "ID",
                 "IsPopular",
                 "MovedUnifiedToken",
                 "Name",
                 "NetworkID",
                 "NetworkName",
                 "PDecimals",
                 "PricePrv",
                 "Priority",
                 "Protocol",
                 "Symbol",
                 "Verify"
             ],
             "title": "Result"
         }
     }
 };

 module.exports = {
     getOtaGenerateSchemas,
     authenProfileSchemas,
     disableFunctionConfigSchemas,
     lastVersionSchemas,
     tradeTokenSchemas,
     uniSwapTokenSchemas,
     curveTokenSchemas
 }