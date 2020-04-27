const { answerCountService } = require('../service')
const response = require('../model/response')


const answerCount = (req, res) => {
    const survey_header_id = req.params.surveyHeaderId

    answerCountService.AnswerCount(survey_header_id).then(data => {
        if (data.length === 0) {
            res.json(response({ success: false, message: "Error", payload: null }))
        }
        else {
            res.json(response({ success: true, message: "Success", payload: data }))
        }
    }).catch(err => console.log(err))

};

module.exports = { answerCount }
