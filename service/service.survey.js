const { surveydb } = require('../db')
const response = require('../model/response')

const getQuestion = (admin_id, surey_header_id, buildingId) => {
    return surveydb.getQuestion(admin_id, surey_header_id, buildingId)
}

// const addAnswer = (other, optionChoiceId, userId, questionId, surey_headers_id, building_id, device_type) => {
//     return surveydb.addAnswer(other, optionChoiceId, userId, questionId, surey_headers_id, building_id, device_type)
// }

const addAnswer = (other, optionChoiceId, userId, questionId, surey_headers_id, building_id, keyValue, totalQuestionCount,answeredDate) => {
    return surveydb.addAnswer(other, optionChoiceId, userId, questionId, surey_headers_id, building_id, keyValue, totalQuestionCount,answeredDate)
}

// const deleteAnswer = (userId, survey_headers_id, building_id, device_type) => {
//     return surveydb.deleteAnswer(userId, survey_headers_id, building_id, device_type);
// }

const deleteAnswer = (userId, survey_headers_id, building_id) => {
    return surveydb.deleteAnswer(userId, survey_headers_id, building_id);
}

const getMenu = (userId, surveyHeaderId, startDate, endDate, viewType) => {
    return surveydb.userLevelAnswer(userId, surveyHeaderId, viewType).then(res => {
        if (res[0][0].user_level_id == 1) {


            const getMenu = (userId) => {
                return surveydb.getMenu(userId);
            }
            return getMenu

        } else {

            const getMenuLevl = (userId) => {
                return surveydb.getMenuLevl(userId);
            }
            return getMenuLevl

        }
    }).catch(err => (response({ success: false, message: err.toString() })));
}

const surveyList = (userId, survey_header_id) => {
    return surveydb.surveyList(userId, survey_header_id);
}


const surveyMenuApi = (userId, surveyHeaderId, startDate, endDate, viewType) => {
    return surveydb.userLevelAnswer(userId, surveyHeaderId, viewType).then(res => {
        if (res[0][0].user_level_id == 1) {


            const surveyMenuApi = (userId) => {
                return surveydb.surveyMenuApi(userId);
            }
            return surveyMenuApi

        } else {

            const surveyMenuApiLevel = (userId) => {
                return surveydb.surveyMenuApiLevel(userId);
            }
            return surveyMenuApiLevel

        }
    }).catch(err => (response({ success: false, message: err.toString() })));
}


const dateTimeMenuApi = (userId, startDate, endDate) => {
    return surveydb.dateTimeMenuApi(userId, startDate, endDate)
}


module.exports = { getQuestion, addAnswer, deleteAnswer, getMenu, surveyList, surveyMenuApi, dateTimeMenuApi };