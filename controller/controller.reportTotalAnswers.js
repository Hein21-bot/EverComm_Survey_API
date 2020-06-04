const { reportTotalAnswersService } = require('../service')
const response = require('../model/response')
var groupArray = require('group-array');


const userLevelAnswer = (req, res) => {
    let surveyHeaderId = req.params.surveyHeaderId
    const userId = req.body.userId
    const startDate = req.body.startDate
    const endDate = req.body.endDate
    const viewType = req.body.viewType

    reportTotalAnswersService.userLevelAnswer(userId, surveyHeaderId, startDate, endDate, viewType).then(data => {

        data(userId, surveyHeaderId, startDate, endDate).then(data => {


            let surveySections = Object.keys(groupArray(data[0], 'survey_section_id')).map((v, k) => {
                return groupArray(data[0], 'survey_section_id')[v];
            });


            let ans = [{
                "survey_header_id": surveySections[0][0].survey_header_id, "survey_name": surveySections[0][0].survey_name,
                "Number_of_buildings": surveySections[0][0].Number_of_buildings, "survey_sections":
                    surveySections.map(section => {
                        return {
                            "survey_section_id": section[0].survey_section_id, "section_name": section[0].section_name, "questions":
                                Object.keys(groupArray(section, 'question_id')).map((v, k) => {
                                    return groupArray(section, 'question_id')[v];
                                }).map((v1, k1) => {
                                    return {
                                        "question_id": v1[0].question_id, "question_name": v1[0].question_name, "totalAnsCount": v1[0].atcount,
                                        "Not_Answer": v1[0].Not_Answer,
                                        "input_type_id": v1[0].input_type_id, "option_choices": v1.map(c => {
                                            return {
                                                "option_choice_name": c.option_choice_name, "totalAns": c.acount, "Percentage": "("+c.Per+")%",
                                                "other": c.other != null && c.other.includes('{') ?
                                                    JSON.parse(c.other) : c.other
                                            }
                                        })

                                    }
                                })
                        };
                    }),"building_count": data[1]
            }];

            res.json(response({ success: true, payload: ans }))


        }).catch(err => res.json(response({ success: false, message: err.toString() })));
    })
}


const userLevelMenuAnswer = (req, res) => {
    let surveyHeaderId = req.params.surveyHeaderId
    const userId = req.params.userId
    const startDate = req.body.startDate
    const endDate = req.body.endDate
    const viewType = req.body.viewType

    reportTotalAnswersService.userLevelMenuAnswer(userId, surveyHeaderId, startDate, endDate, viewType).then(data => {
        // console.log(data)
        data(userId, startDate, endDate).then(data => {

            let surveySections = Object.keys(groupArray(data, 'survey_header_id')).map((v, k) => {
                return groupArray(data, 'survey_header_id')[v];
            }).map((v1, k1) => {
                return {
                    "survey_header_id": v1[0].survey_header_id, "survey_name": v1[0].survey_name,
                    "survey_created_date": v1[0].created_date.toString(),
                    "amount_of_survey": Object.keys(groupArray(v1, 'buildings_id')).map((v2, k2) => {
                        return groupArray(v1, 'buildings_id')[v2];
                    }).map((v3, k3) => {
                        return {
                            "building_id": v3[0].buildings_id, "building_name": v3[0].building_name
                        }
                    }),
                    "survey_section": Object.keys(groupArray(v1, 'survey_section_id')).map((v4, k4) => {
                        return groupArray(v1, 'survey_section_id')[v4];
                    }).map((v5, k5) => {
                        return {
                            "survey_section_id": v5[0].survey_section_id, "survey_section_name": v5[0].section_name
                        }
                    })
                }
            })
            res.json(response({ success: true, payload: surveySections }))

        }).catch(err => res.json(response({ success: false, message: err.toString() })));
    })
}


module.exports = { userLevelAnswer, userLevelMenuAnswer }
