const { surveydb } = require('../db')

const getQuestion = (admin_id, surey_header_id) => {
    return surveydb.getQuestion(admin_id, surey_header_id);
}

const addAnswer = (other, optionChoiceId, userId, questionId, surey_headers_id) => {
    return surveydb.addAnswer(other, optionChoiceId, userId, questionId, surey_headers_id);
}

const deleteAnswer = (userId, survey_headers_id) => {
    return surveydb.deleteAnswer(userId, survey_headers_id);
}

const getMenu = (userId) => {
    return surveydb.getMenu(userId);
}

module.exports = { getQuestion, addAnswer, deleteAnswer, getMenu };