const {surveydb} = require('../db')

const getQuestion = (admin_id,surey_header_id) => {
    return surveydb.getQuestion(admin_id,surey_header_id);
}

const addAnswer = (other, optionChoiceId, userId, questionId) =>{
    return surveydb.addAnswer(other, optionChoiceId, userId, questionId);
}

const deleteAnswer = (userId) => {
    return surveydb.deleteAnswer(userId);
}

module.exports = {getQuestion, addAnswer, deleteAnswer};