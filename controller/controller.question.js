const { questionService } = require("../service");
const response = require("../model/response");


const createQuestion = (req, res) => {
    const question_name = req.body.question_name
    const is_other = req.body.is_other
    const required = req.body.required == true ? 1 : 0
    const option_groups_id = req.body.option_groups_id
    const units_id = req.body.units_id
    const survey_sections_id = req.body.survey_sections_id
    const input_types_id = req.body.input_types_id
    const survey_headers_id = req.body.survey_headers_id
    const device_type = req.body.survey_headers_id

    questionService.createQuestion(question_name, is_other, required, option_groups_id, units_id, survey_sections_id, input_types_id, survey_headers_id, device_type)
        .then(data => {
            return res.json(
                response({
                    success: true,
                    message: "Inserted!",
                    payload: data
                })
            );

        }).catch(err => {
            res.json(response({ success: false, message: err }));
        });
}

const createOptionChoice = (req, res) => {
    const option_choice_name = req.body.option_choice_name
    const questions_id = req.body.questions_id


    questionService.createOptionChoice(option_choice_name, questions_id)
        .then(data => {
            return res.json(
                response({
                    success: true,
                    message: "Inserted!",
                    payload: data
                })
            );

        }).catch(err => {
            res.json(response({ success: false, message: err }));
        });
}



module.exports = { createQuestion, createOptionChoice }

// @ add with array req.body

// const createQuestion = (req, res) => {
//     // 
//     const data = req.body.data
//     return questionService.createQuestion(data).then(result => {
//         console.log("Result is", result)
//         res.json(response({
//             success: true,
//             payload: result
//         }))
//     }).catch(error => {
//         res.json(response({
//             success: false,
//             error: error.toString()
//         }))
//     })

// }