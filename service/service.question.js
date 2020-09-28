const { surveydb } = require('../db')
const response = require('../model/response')

const createQuestion = async ({ data }) => {
    const resultArr = []
    try {
        for (let i = 0; i < data.length; i++) {

            const d = data[i]
            if (d.optionChoices == undefined) {
                const questionName = d.questionName
                const isOther = d.isOther
                const required = d.required
                const optionGroupId = d.optionGroupId
                const unitsId = d.unitsId
                const surveySectionId = d.surveySectionId
                const inputTypeId = d.inputTypeId
                const surveyHeaderId = d.surveyHeaderId
                const buildingType = d.buildingType == null ? null : d.buildingType
                const saveResult = await surveydb.createQuestion({ questionName, isOther, required, optionGroupId, unitsId, surveySectionId, inputTypeId, surveyHeaderId, buildingType })
            } else {
                const questionName = d.questionName
                const isOther = d.isOther
                const required = d.required
                const optionGroupId = d.optionGroupId
                const unitsId = d.unitsId
                const surveySectionId = d.surveySectionId
                const inputTypeId = d.inputTypeId
                const surveyHeaderId = d.surveyHeaderId
                const buildingType = d.buildingType == null ? null : d.buildingType
                const saveResult = await surveydb.createQuestion({ questionName, isOther, required, optionGroupId, unitsId, surveySectionId, inputTypeId, surveyHeaderId, buildingType })
                const optionChoiceArr = d.optionChoices
                for (let j = 0; j < optionChoiceArr.length; j++) {
                    const d = optionChoiceArr[j]
                    const optionChoiceName = d.optionChoices
                    const questionId = saveResult.insertId
                    const saveOptionChoiceResult = await surveydb.createOptionChoice({ optionChoiceName, questionId })
                    resultArr.push(saveOptionChoiceResult)
                }
            }

        }
        return resultArr

    }
    catch (error) {
        throw error
    }
}




module.exports = { createQuestion }


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