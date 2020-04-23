const { buildingService } = require('../service')
const response = require('../model/response')
const { surveydb } = require('../db')

const addBuilding = (req, res) => {
    console.log("body: ", req.body)
    const buildingName = req.body.buildingName
    const companyName = req.body.companyName
    const address = req.body.address
    const postalCode = req.body.postalCode
    const country = req.body.country
    const comment = req.body.comment
    const user_id = req.body.user_id
    const survey_headers_id = req.body.survey_headers_id

    buildingService.addBuilding(buildingName, companyName, address, postalCode, country, comment, user_id, survey_headers_id)
        .then(data => {
            console.log("data is ==>", data)
            return res.json(
                response({
                    success: true,
                    message: "Inserted!",
                    payload: data
                })
            );

        }).catch(err => {
            console.log("error: ", err)
            res.json(response({ success: false, message: err }));
        });
}

const getBuilding = (req, res) => {
    buildingService.getAdmin().then(data => {
        res.json(response({ success: true, payload: data }))
    }).catch(err => res.json(response({ success: false, message: err })));
}

module.exports = { addBuilding, getBuilding }