const { surveydb } = require("../db");
const { produceToken } = require("../security/token");
const bcrypt = require("bcrypt");
const response = require("../model/response");
const saltRounds = 10

const login = (email, password, callbackWhenDone) => {
  return surveydb.login(email, password)
    .then((res) => {
      const result = res[0][0];
      if (res[0].length) {
        const hash = result.password.toString();
        return bcrypt.compare(password, hash, function (err, response) {
          if (response === true) {
            const payload = {
              email: result.email,
              password: result.password,
            };
            const token = produceToken(payload);
            const data = {
              token: token,
              login_user_id: result.login_user_id,
              email: result.email,
              user_level_id: result.user_level_id,
              user_level: result.name
            }

            return callbackWhenDone(null, data);
          } else {
            return callbackWhenDone(null, false);
          }
        });
      } else {
        return callbackWhenDone(null, false);
      }
    })
    .catch((err) => response({ error: err, success: false, message: err }));
};

module.exports = { login };
