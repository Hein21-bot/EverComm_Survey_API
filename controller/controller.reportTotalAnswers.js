const { reportTotalAnswersService } = require('../service')
const response = require('../model/response')
var groupArray = require('group-array');


const reportTotalAnswers = (req, res) => {
    const survey_header_id = req.params.surveyHeaderId

    reportTotalAnswersService.reportTotalAnswers(survey_header_id).then(data => {
        let surveySections = Object.keys(groupArray(data, 'survey_header_id'))
            .map((v, k) => {
                return groupArray(data, 'survey_header_id')[v];
            });

        let ans = [{
            "surveyHeaderName: ": surveySections[0][0].survey_name, "section_name: ": surveySections[0][0].section_name, TotalReportData:
                Object.keys(groupArray(surveySections[0], 'question_id')).map((v, k) => {
                    return groupArray(surveySections[0], 'question_id')[v];
                }).map((v1, k1) => {
                    return {
                        "Question": v1[0].question_name, "Answers": v1.map(c => {
                            return {
                                "option_choice_name": c.option_choice_name, "totalAns": c.acount
                            }
                        })
                    }
                })

        }];
        res.json(response({ success: true, payload: ans }))

    }).catch(err => res.json(response({ success: false, message: err })));
}

module.exports = { reportTotalAnswers }
