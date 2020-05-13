const { reportTotalAnswersService } = require('../service')
const response = require('../model/response')
var groupArray = require('group-array');


const reportTotalAnswers = (req, res) => {
    const survey_header_id = req.params.surveyHeaderId
    const startDate = req.body.startDate
    const endDate = req.body.endDate


    reportTotalAnswersService.reportTotalAnswers(survey_header_id, startDate, endDate).then(data => {


        let surveySections = Object.keys(groupArray(data[0], 'survey_section_id')).map((v, k) => {
            return groupArray(data[0], 'survey_section_id')[v];
        });

        let ans = [{
            "survey_header_id": surveySections[0][0].survey_header_id, "survey_name": surveySections[0][0].survey_name, "survey_sections":
                surveySections.map(section => {
                    return {
                        "survey_section_id": section[0].survey_section_id, "section_name": section[0].section_name, "questions":
                            Object.keys(groupArray(section, 'question_id')).map((v, k) => {
                                return groupArray(section, 'question_id')[v];
                            }).map((v1, k1) => {
                                return {
                                    "question_id": v1[0].question_id, "question_name": v1[0].question_name, "totalAnsCount": v1[0].atcount, "input_type_id": v1[0].input_type_id, "option_choices": v1.map(c => {
                                        return {
                                            "option_choice_name": c.option_choice_name, "totalAns": c.acount
                                        }
                                    })
                                }
                            })
                    };
                }), "building_count": data[1]
        }];
        res.json(response({ success: true, payload: ans }))


    }).catch(err => res.json(response({ success: false, message: err })));




}

const reportDateTimeAnswers = (req, res) => {
    const survey_header_id = req.params.surveyHeaderId
    const startDate = req.body.startDate
    const endDate = req.body.endDate


    reportTotalAnswersService.reportDateTimeAnswers(survey_header_id, startDate, endDate).then(data => {


        let surveySections = Object.keys(groupArray(data, 'survey_section_id')).map((v, k) => {
            return groupArray(data, 'survey_section_id')[v];
        });

        let ans = [{
            "survey_header_id": surveySections[0][0].survey_header_id, "survey_name": surveySections[0][0].survey_name, "survey_sections":
                surveySections.map(section => {
                    return {
                        "survey_section_id": section[0].survey_section_id, "section_name": section[0].section_name, "questions":
                            Object.keys(groupArray(section, 'question_id')).map((v, k) => {
                                return groupArray(section, 'question_id')[v];
                            }).map((v1, k1) => {
                                return {
                                    "question_id": v1[0].question_id, "question_name": v1[0].question_name, "totalAnsCount": v1[0].atcount, "input_type_id": v1[0].input_type_id, "other": v1.map(c => {
                                        return {
                                            "DateTime":JSON.parse(c.other)
                                        }
                                    })
                                }
                            })
                    };
                })
        }];
        res.json(response({ success: true, payload: ans }))


    }).catch(err => res.json(response({ success: false, message: err })));




}

module.exports = { reportTotalAnswers, reportDateTimeAnswers }
