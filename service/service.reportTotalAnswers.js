const { surveydb } = require('../db')
const response = require('../model/response')


const userLevelAnswer = (userId, surveyHeaderId, startDate, endDate, viewType) => {
    return surveydb.userLevelAnswer(userId, surveyHeaderId).then(res => {
        if (res[0].user_level_id == 1) {

            if (viewType == "all") {
                const reportTotalAnswers = (userId, survey_header_id, startDate, endDate) => {
                    return surveydb.reportTotalAnswers(userId, survey_header_id, startDate, endDate);
                }
                return reportTotalAnswers
            } else {

                const reportUserAnswer = (userId, survey_header_id, startDate, endDate) => {
                    return surveydb.reportUserAnswer(userId, survey_header_id, startDate, endDate);
                }
                return reportUserAnswer
            }

        } else if (res[0].user_level_id == 2) {

            const reportUserAnswer = (userId, surveyHeaderId, startDate, endDate) => {
                return surveydb.reportUserAnswer(userId, surveyHeaderId, startDate, endDate);
            }
            return reportUserAnswer

        } else {
            console.log("viewType of report total answer==>", viewType)
            if (viewType == "all") {

                const reportDistributorAnswers = (userId, surveyHeaderId, startDate, endDate) => {
                    return surveydb.reportDistributorAnswers(userId, surveyHeaderId, startDate, endDate);
                }
                return reportDistributorAnswers
            } else {
                const reportUserAnswer = (userId, surveyHeaderId, startDate, endDate) => {
                    return surveydb.reportUserAnswer(userId, surveyHeaderId, startDate, endDate);
                }
                return reportUserAnswer
            }

        }
    }).catch(err => (response({ success: false, message: err.toString() })));
}



module.exports = { userLevelAnswer }