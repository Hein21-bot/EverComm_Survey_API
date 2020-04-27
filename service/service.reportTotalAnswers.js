const { surveydb } = require('../db')

const reportTotalAnswers = (survey_header_id) => {
    return surveydb.reportTotalAnswers(survey_header_id);
}


module.exports = { reportTotalAnswers }