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

 module.exports = {
     getOtaGenerateSchemas,
     authenProfileSchemas
 }