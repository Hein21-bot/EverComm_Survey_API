const { surveydb } = require('../db')

const getBuilding = () => {
    return surveydb.getBuilding();
}

const addBuilding = (buildingName, companyName, address, postalCode, country, comment, userId, surveyHeadersId) => {
    return surveydb.addBuilding(buildingName, companyName, address, postalCode, country, comment, userId, surveyHeadersId);
}

module.exports = { getBuilding, addBuilding }