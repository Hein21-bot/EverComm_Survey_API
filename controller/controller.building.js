const { buildingService } = require('../service')
const response = require('../model/response')
const { surveydb } = require('../db')

const addBuilding = (req, res) => {
    const buildingName = req.body.buildingName
    const companyName = req.body.companyName
    const address = req.body.address
    const postalCode = req.body.postalCode
    const country = req.body.country
    const comment = req.body.comment
    const userId = req.body.userId
    const surveyHeadersId = req.body.surveyHeaderId

    buildingService.addBuilding(buildingName, companyName, address, postalCode, country, comment, userId, surveyHeadersId)
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

const getBuilding = (req, res) => {
    buildingService.getAdmin().then(data => {
        res.json(response({ success: true, payload: data }))
    }).catch(err => res.json(response({ success: false, message: err })));
}



module.exports = { addBuilding, getBuilding }