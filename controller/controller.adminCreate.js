const { adminCreateService } = require("../service");
const response = require("../model/response");
const moment = require("moment");


const surveyHeader = (req, res) => {
    const user_id = req.params.user_id
    const surveyName = req.body.surveyName
    const remark = req.body.remark
    const active = req.body.active == true ? 1 : 0
    const sectionData = req.body.sectionData
    const created_date = moment.utc(new Date()).local().format('YYYY-MM-DD HH:mm:ss')
    const modified_date = moment.utc(new Date()).local().format('YYYY-MM-DD HH:mm:ss')

    return adminCreateService.surveyHeader(surveyName, remark, active, user_id, created_date, modified_date)
        .then(dataResulted => {
            if (dataResulted.length != 0) {
                if (sectionData.length >= 0) {
                    const surveyHeaderId = dataResulted.insertId
                    return adminCreateService.surveySection({ sectionData, surveyHeaderId }).then(data1 => {
                        return adminCreateService.getAdminId().then(data => {
                            return adminCreateService.userSurveyPermession({ data, surveyHeaderId }).then(data => {
                                res.json(
                                    response({
                                        success: true,
                                        message: "New survey created!",
                                        payload: dataResulted
                                    })
                                )
                            })
                        })
                    }).catch(err1 => { throw err1.toString() })
                } else {
                    return dataResulted
                }
            } else {
                res.json(
                    response({
                        message: "You have no permession to Create survey header & section!",
                    })
                )

            }

        }).catch(err => {
            res.json(response({ success: false, message: err.code, error: err }));
        });


};



const surveyHeaderEdit = (req, res) => {
    const user_id = req.params.user_id
    const surveyHeaderId = req.body.surveyHeaderId
    const surveyName = req.body.surveyName
    const remark = req.body.remark
    const active = req.body.active == true ? 1 : 0
    const sectionData = req.body.data
    const modified_date = moment.utc(new Date()).local().format('YYYY-MM-DD HH:mm:ss')



    return adminCreateService.surveyHeaderEdit(surveyHeaderId, surveyName, remark, active, user_id, modified_date)
        .then(dataResulted => {
            if (dataResulted.length != 0) {
                if (sectionData.length >= 0) {
                    adminCreateService.surveySectionRemove(survey_header_id)
                    return adminCreateService.surveySection({ sectionData, survey_header_id }).then(data1 => {
                        res.json(
                            response({
                                success: true,
                                message: "Survey Updated!",
                                payload: null
                            })
                        )
                    }).catch(err1 => { throw err1 })
                } else {
                    return dataResulted
                }
            } else {
                res.json(
                    response({
                        message: "You have no permession to Edit survey header & section!",
                    })
                )

            }

        }).catch(err => {
            res.json(response({ success: false, message: err.code, error: err }));
        });


};

const removeSurveyHeader = (req, res) => {
    const surveyHeaderId = req.params.surveyHeaderId

    return adminCreateService.removeSurveyHeader(surveyHeaderId).then(data => {
        res.json(
            response({
                success: true,
                message: "Survey Successfully Removed!",
                payload: null
            })
        ).catch(err => {
            res.json(response({ success: false, message: err.code, error: err }));
        });
    })
}



const surveySection = (req, res) => {
    const sectionData = req.body.sectionData
    const surveyHeaderId = req.body.surveyHeaderId


    return adminCreateService.surveySection({ sectionData, surveyHeaderId }).then(data1 => {
        res.json(
            response({
                success: true,
                message: "New Section created!",
                payload: data1
            })
        )
    }).catch(err => {
        res.json(response({ success: false, message: err.code, error: err }));
    });
}




module.exports = { surveyHeader, surveyHeaderEdit, removeSurveyHeader, surveySection }