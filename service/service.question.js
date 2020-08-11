const { surveydb } = require('../db')
const response = require('../model/response')

const createQuestion = (question_name, is_other, required, option_groups_id, units_id, survey_sections_id, input_types_id, survey_headers_id, device_type) => {
    return surveydb.createQuestion(question_name, is_other, required, option_groups_id, units_id, survey_sections_id, input_types_id, survey_headers_id, device_type);
}

const createOptionChoice = (option_choice_name, questions_id) => {
    return surveydb.createOptionChoice(option_choice_name, questions_id);
}


module.exports = { createQuestion, createOptionChoice }


// @ add with array req.body


// const createQuestion = async (data) => {
//     const resultArr =[]
//     try {
//         for (let i = 0; i < data.length; i++) {
//             const d = data[i]
//             const saveResult = await surveydb.createQuestion(d.question_name, d.is_other, d.required, d.option_groups_id, d.units_id, d.survey_sections_id, d.input_types_id, d.survey_headers_id, d.survey_headers_id)
//             resultArr.push(saveResult) 
//         }
//         return resultArr
//     }
//     catch (error) {
//         throw error
//     }

// }