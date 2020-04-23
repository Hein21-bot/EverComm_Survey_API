const { surveydb } = require('../db')

const getBuilding = () => {
    return surveydb.getBuilding();
}

const addBuilding = (buildingName, companyName, address, postalCode, country, comment, user_id, survey_headers_id) => {
    return surveydb.addBuilding(buildingName, companyName, address, postalCode, country, comment, user_id, survey_headers_id);
}

module.exports = { getBuilding, addBuilding }