const { questionService } = require("../service");
const response = require("../model/response");
const { format } = require("util");


const createQuestion = (req, res) => {
    const data = req.body.question
    return questionService.createQuestion({ data }).then(dataResult => {
        return res.json(
            response({
                success: true,
                message: "Inserted!",
                payload: dataResult
            })
        )
    }).catch(err => {
        res.json(response({ success: false, message: err }));
    });
}

// const createOptionChoice = (req, res) => {
//     const option_choice_name = req.body.option_choice_name
//     const questions_id = req.body.questions_id


//     questionService.createOptionChoice(option_choice_name, questions_id)
// .then(data => {
//     return res.json(
//         response({
//             success: true,
//             message: "Inserted!",
//             payload: data
//         })
//     );

//         }).catch(err => {
//             res.json(response({ success: false, message: err }));
//         });
// }



module.exports = { createQuestion }

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