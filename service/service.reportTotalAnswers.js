const { surveydb } = require('../db')

const reportTotalAnswers = (survey_header_id,survey_section_id) => {
    return surveydb.reportTotalAnswers(survey_header_id,survey_section_id);
}


module.exports = { reportTotalAnswers }