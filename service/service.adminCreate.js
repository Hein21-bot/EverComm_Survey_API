const { surveydb } = require('../db')


const surveyHeader = (survey_name, remark, active, user_id) => {
    return surveydb.surveyHeader(survey_name, remark, active, user_id)

}

const surveySection = async ({ data, survey_header_id }) => {
    const resultArr = []
    try {
        for (let i = 0; i < data.length; i++) {
            const d = data[i]
            const page_no = i + 1
            const active = d.active
            const section_name = d.section_name

            const saveResult = await surveydb.surveySection({ page_no, active, survey_header_id, section_name })
            resultArr.push(saveResult)
        }
        return resultArr

    }
    catch (error) {
        throw error
    }

}

module.exports = { surveyHeader, surveySection }