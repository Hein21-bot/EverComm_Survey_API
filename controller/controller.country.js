const { countryService } = require("../service");
const response = require("../model/response");

const addCountry = (req, res) => {
    const country = req.body.country
    const organization = req.body.organization
    const surveyHeaderId = req.body.surveyHeaderId
    const userId = req.body.userId

    return countryService.addCountry(country, organization, surveyHeaderId, userId).then(dataResult => {
        if (dataResult.length > 0) {
            return res.json(
                response({
                    success: true,
                    message: "Inserted!",
                    payload: dataResult
                })
            )
        }else{
            return res.json(
                response({
                    success: false,
                    message: "Country and Organization already have"
                })
            )
        }
    }).catch(err => {
        res.json(response({ success: false, message: err }));
    });
}

const getCountry = (req, res) => {
    const surveyHeaderId = req.params.surveyHeaderId

    return countryService.getCountry(surveyHeaderId).then(dataResult => {
        return res.json(
            response({
                success: true,
                message: "Success!",
                payload: dataResult
            })
        )
    }).catch(err => {
        res.json(response({ success: false, message: err }));
    });
}

const getCountrySurvey = (req, res) => {
    const surveyHeaderId = req.params.surveyHeaderId

    return countryService.getCountrySurvey(surveyHeaderId).then(dataResult => {
        return res.json(
            response({
                success: true,
                message: "Success!",
                payload: dataResult
            })
        )
    }).catch(err => {
        res.json(response({ success: false, message: err }));
    });
}

module.exports = { addCountry, getCountry, getCountrySurvey }