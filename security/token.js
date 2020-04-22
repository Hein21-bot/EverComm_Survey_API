const jwt = require("jsonwebtoken");
const fs = require("fs");
const privateKey = fs.readFileSync("security/private.key");
const publicKey = fs.readFileSync("security/public.pem");
const response = require("../model/response")

const produceToken = payload => {
  return jwt.sign(payload, privateKey, { expiresIn: "1d" });
};

const verifyToken = (req, res, next) => {
  const header = req.headers["authorization"];
  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    req.token = token;
    next();
  } else {
    res.json(
      response({ 
        success: false, 
        message: "You are not allowed to access this url!"
      })
    )
  }
};

const verifyTokenSync = reqHeader => {
  // if(reqHeader===undefined || reqHeader===null) return null;
  const authToken = reqHeader.split(" ")
  if(authToken.length !== 2) return null;
  if(authToken[1]===undefined || authToken[1]===null || authToken[1].length ===0) return null;
  return authToken[1]
};

module.exports.produceToken = produceToken;
module.exports.verifyTokenSync = verifyTokenSync;
module.exports.verifyToken = verifyToken;
