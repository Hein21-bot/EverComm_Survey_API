const { surveydb } = require('../db')

const AnswerCount = (email) => {
    return surveydb.AnswerCount(email);
}


module.exports = { AnswerCount }