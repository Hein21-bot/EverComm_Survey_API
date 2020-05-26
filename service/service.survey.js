const { surveydb } = require('../db')
const response = require('../model/response')

const getQuestion = (admin_id, surey_header_id, buildingId) => {
    return surveydb.getQuestion(admin_id, surey_header_id, buildingId);
}

const addAnswer = (other, optionChoiceId, userId, questionId, surey_headers_id, building_id) => {
    return surveydb.addAnswer(other, optionChoiceId, userId, questionId, surey_headers_id, building_id);
}

const deleteAnswer = (userId, survey_headers_id, building_id) => {
    return surveydb.deleteAnswer(userId, survey_headers_id, building_id);
}

const getMenu = (userId) => {
    return surveydb.getMenu(userId);
}

const surveyList = (userId, survey_header_id) => {
    return surveydb.surveyList(userId, survey_header_id);
}

const surveyMenuApi = (userId) => {
    return surveydb.surveyMenuApi(userId)
}

const newSurveyList = (userId, survey_header_id) => {
    return surveydb.newSurveyList(userId, survey_header_id)
}

const dateTimeMenuApi = (userId, startDate, endDate) => {
    return surveydb.dateTimeMenuApi(userId, startDate, endDate)
}

const userLevelAnswer = (userId, surveyHeaderId, startDate, endDate) => {
    return surveydb.userLevelAnswer(userId, surveyHeaderId).then(res => {
        if (res[0].user_level_id == 1) {
            console.log(res[0].user_level_id )
            
            const dateTimeMenuAdminApi = (userId, startDate, endDate) => {
                return surveydb.dateTimeMenuAdminApi(userId, startDate, endDate);
            }
            console.log(res[0].user_level_id )
            return dateTimeMenuAdminApi

        } else {
            console.log(res[0].user_level_id);
            
            const dateTimeMenuApi = (userId, startDate, endDate) => {
                return surveydb.dateTimeMenuApi(userId, startDate, endDate);
            }
            return dateTimeMenuApi

        }
    }).catch(err => (response({ success: false, message: err.toString() })));
}

module.exports = { getQuestion, addAnswer, deleteAnswer, getMenu, surveyList, surveyMenuApi, newSurveyList, dateTimeMenuApi ,userLevelAnswer};