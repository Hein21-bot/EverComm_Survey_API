const { surveydb } = require('../db')



const addBuilding = (buildingName, companyName, address, postalCode, country, comment, userId, surveyHeadersId,chiller,condenser,evaporator,coolingTower) => {
    return surveydb.addBuilding(buildingName, companyName, address, postalCode, country, comment, userId, surveyHeadersId,chiller,condenser,evaporator,coolingTower);
}

module.exports = {  addBuilding }