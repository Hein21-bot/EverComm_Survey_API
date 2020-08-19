const { adminCreateService } = require("../service");
const response = require("../model/response");



const surveyHeader = (req, res) => {
    const survey_name = req.body.survey_name
    const remark = req.body.remark
    const active = req.body.active == true ? 1 : 0
    const user_id = req.body.user_id
    const data = req.body.data



    return adminCreateService.surveyHeader(survey_name, remark, active, user_id)
        .then(dataResulted => {

            if (data.length >= 0) {
                const survey_header_id = dataResulted.insertId
                return adminCreateService.surveySection({ data,survey_header_id }).then(data1 => {
                    res.json(
                        response({
                            success: true,
                            message: "Inserted!",
                            payload: data
                        })
                    )
                }).catch(err1 => { throw err1 })
            } else {
                return dataResulted
            }

        }).catch(err => {
            res.json(response({ success: false, message: err.code, error: err }));
        });


};

const surveySection = (req, res, sId) => {
    const survey_header_id = req.body.survey_header_id || sId
    const section_name = req.body.section_name

    return adminCreateService.surveySection({ section_name, page_no, active, survey_header_id })
        .then(result => {
            res.json(response({
                success: true,
                payload: result
            }))
        })
        .catch(error => {
            res.json(response({
                success: false,
                error: error
            }))
        })
}



module.exports = { surveyHeader, surveySection }