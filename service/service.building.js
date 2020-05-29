const { surveydb } = require('../db')



const addBuilding = (buildingName, companyName, address, postalCode, country, comment, userId, surveyHeadersId) => {
    return surveydb.addBuilding(buildingName, companyName, address, postalCode, country, comment, userId, surveyHeadersId);
}

module.exports = {  addBuilding }