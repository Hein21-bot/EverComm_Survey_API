const { surveydb } = require('../db')
const response = require('../model/response')

const getQuestion = (admin_id, surey_header_id, buildingId, buildingTypeId) => {
    return surveydb.getQuestion(admin_id, surey_header_id, buildingId, buildingTypeId)
    // .then(data=>{
    //     if(data[0].length>0){
    //         const result = data[0].reduce((r,c)=>{
    //          const R =[...r]
    //          const index = R.findIndex(v=>v.survey_header_id == c.survey_header_id)

    //          if(index === -1){

    //             R.push({ 
    //                 survey_header_id:c.survey_header_id,survey_name:c.survey_name,survey_sections:[{survey_section_id:c.survey_section_id,section_name:c.section_name,
    //                     questions:[
    //                         { question_id:c.question_id,question_name:c.question_name,input_type_id:c.input_type_id,option_choices:[

    //                             { option_choice_id:c.option_choice_id,option_choice_name:c.option_choice_name}]
    //                         }]
    //                 }]

    //             })
    //           }
    //          else{

    //             const index2 = R.findIndex(v=>v.survey_sections.survey_section_id == c.survey_section_id)

    //             if(index2 === -1){
    //                 R.push({

    //                     survey_sections:[{survey_section_id:c.survey_section_id,section_name:c.section_name,
    //                         questions:[
    //                             { question_id:c.question_id,question_name:c.question_name,input_type_id:c.input_type_id,option_choices:[

    //                                 { option_choice_id:c.option_choice_id,option_choice_name:c.option_choice_name}]
    //                             }]
    //                     }]


    //                 })
    //             }
    //             else {
    //                 R[index].survery_sections.push([
    //                     {survey_section_id:c.survey_section_id,section_name:c.section_name,
    //                         questions:[
    //                             { question_id:c.question_id,question_name:c.question_name,input_type_id:c.input_type_id,option_choices:[

    //                                 { option_choice_id:c.option_choice_id,option_choice_name:c.option_choice_name}]
    //                             }]
    //                     } 
    //                 ])
    //             }

    //          }


    //          return R
    //         },[])
    //         console.log(result,"res")
    //         return result
    //     }
    // })
}

// const addAnswer = (other, optionChoiceId, userId, questionId, surey_headers_id, building_id, device_type) => {
//     return surveydb.addAnswer(other, optionChoiceId, userId, questionId, surey_headers_id, building_id, device_type)
// }

const addAnswer = (other, optionChoiceId, userId, questionId, surey_headers_id, building_id, keyValue, totalQuestionCount, answeredDate, buildingType) => {
    return surveydb.addAnswer(other, optionChoiceId, userId, questionId, surey_headers_id, building_id, keyValue, totalQuestionCount, answeredDate, buildingType)
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