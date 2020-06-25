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
    const chiller=req.body.chiller
    const condenser=req.body.condenser
    const evaporator=req.body.evaporator
    const coolingTower=req.body.coolingTower
    const surveyHeadersId = req.body.surveyHeaderId


    buildingService.addBuilding(buildingName, companyName, address, postalCode, country, comment, userId, surveyHeadersId,chiller,condenser,evaporator,coolingTower)
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





module.exports = { addBuilding }

