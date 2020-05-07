const { surveydb } = require('../db')

const reportTotalAnswers = (survey_header_id, startDate, endDate) => {
    return surveydb.reportTotalAnswers(survey_header_id, startDate, endDate);
}


module.exports = { reportTotalAnswers }