const { verifyTokenSync } = require("../security/token");
const response = require("../model/response");
const fs = require("fs");
const privateKey = fs.readFileSync("./security/private.key");

const jwt = require("jsonwebtoken");

const routeMiddleware = (req, res, next) => {
    console.log("Hello")
  const allowedRoutes = ["/auth/login"];
  if (allowedRoutes.findIndex(r => r === req.url) >= 0) return next();

  if (!req.headers["authorization"]) {
    return res.json(
      response({
        success: false,
        message: "Token is required!"
      })
    );
  }
  const token = verifyTokenSync(req.headers["authorization"]);
  if (token === null) {
    return res.json(
      response({
        success: false,
        message: "Token is not in valid format!"
      })
    );
  }

  return jwt.verify(token, privateKey, (err, payload) => {
    if (err) {
      return res.json(
        response({
          success: false,
          message: "Token error!",
          error: err
        })
      );
    } else {
      if (payload) {
        return next();
      } else {
        return res.json(
          response({
            success: false,
            message: "No user with your information!"
          })
        );
      }
    }
  });
};

module.exports.routeMiddleware = routeMiddleware