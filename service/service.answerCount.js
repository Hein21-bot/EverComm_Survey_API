const { surveydb } = require('../db')

const AnswerCount = (survey_header_id) => {
    return surveydb.AnswerCount(survey_header_id);
}


module.exports = { AnswerCount }