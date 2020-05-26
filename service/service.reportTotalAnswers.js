const { surveydb } = require('../db')
const response = require('../model/response')

const reportTotalAnswers = (survey_header_id, startDate, endDate) => {
    return surveydb.reportTotalAnswers(survey_header_id, startDate, endDate);
}

const reportUserAnswer = (surveyHeaderId, startDate, endDate) => {
    return surveydb.reportUserAnswer(surveyHeaderId, startDate, endDate);
}

// const reportDateTimeAnswers = (survey_header_id, startDate, endDate) => {
//     return surveydb.reportDateTimeAnswers(survey_header_id, startDate, endDate);
// }

const userLevelAnswer = (userId, surveyHeaderId, startDate, endDate) => {
    return surveydb.userLevelAnswer(userId, surveyHeaderId).then(res => {
        if (res[0].user_level_id == 1) {
            // console.log(res[0].user_level_id);
            console.log(res[0].user_level_id )
            
            const reportTotalAnswers = (userId, survey_header_id, startDate, endDate) => {
                return surveydb.reportTotalAnswers(userId, survey_header_id, startDate, endDate);
            }
            console.log(res[0].user_level_id )
            return reportTotalAnswers

        } else {
            // console.log(res[0].user_level_id);
            
            const reportUserAnswer = (userId, surveyHeaderId, startDate, endDate) => {
                return surveydb.reportUserAnswer(userId, surveyHeaderId, startDate, endDate);
            }
            return reportUserAnswer

        }
    }).catch(err => (response({ success: false, message: err.toString() })));
}



module.exports = { reportTotalAnswers, userLevelAnswer, reportUserAnswer }