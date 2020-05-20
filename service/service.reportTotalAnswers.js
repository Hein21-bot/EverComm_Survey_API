const { surveydb } = require('../db')
const response = require('../model/response')

const reportTotalAnswers = (survey_header_id, startDate, endDate) => {
    return surveydb.reportTotalAnswers(survey_header_id, startDate, endDate);
}

const reportDateTimeAnswers = (survey_header_id, startDate, endDate) => {
    return surveydb.reportDateTimeAnswers(survey_header_id, startDate, endDate);
}

const userLevelAnswer = (userId,surveyHeaderId) => {
    return surveydb.userLevelAnswer(userId,surveyHeaderId).then(res => {
        if (res[0][0].user_level_id == 2) {
            const data = res[1]
            return data
            
        } else {
            const data = res[2]
            return data

        }
    }).catch(err => (response({ success: false, message: err.toString() })));
}



module.exports = { reportTotalAnswers, reportDateTimeAnswers, userLevelAnswer }