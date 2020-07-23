const jwt = require("jsonwebtoken");
const config = require('config');
const secret = config.get('secret');

module.exports.makeBrandUser = () => jwt.sign({
    "_id": "5af2ab7e7b8e4f6e3ca03473",
    "username": "solmaz",
    "role": "tenant",
    "profile": {},
    "publishers": [],
    "creators": [],
    "brands": [{ id: 1, name: "lg" }],
    "agencies": [{ id: -1, name: "VideoBoom" }],
    "active": 1,
    "iat": 1525937823
}, secret);

module.exports.makeAgencyUser =() => jwt.sign({
    "_id": "5af2ab7e7b8e4f6e3ca03473",
    "username": "solmaz",
    "role": "tenant",
    "profile": {},
    "publishers": [],
    "creators": [],
    "brands": [],
    "agencies": [{ id: -1 , name: "VideoBoom" }],
    "active": 1,
    "iat": 1525937823
}, secret);

module.exports.makeAdminUser =() => jwt.sign({
    "_id": "5af2ab7e7b8e4f6e3ca03473",
    "username": "solmaz",
    "role": "admin",
    "profile": {},
    "publishers": [],
    "creators": [],
    "brands": [],
    "agencies": [],
    "active": 1,
    "iat": 1525937823
}, secret);


module.exports.makeOtherAgencyUser = () => jwt.sign({
    "_id": "5af2ab7e7b8e4f6e3ca03473",
    "username": "solmaz",
    "role": "agency",
    "profile": {},
    "publishers": [],
    "creators": [],
    "brands": [],
    "agencies": [{ id: 2, name: "Sabavision" }],
    "active": 1,
    "iat": 1525937823
}, secret);


