const { surveydb } = require('../db')



const addBuilding = (buildingName, companyName, buildingType, buildingTypeId, address, postalCode, country, comment, userId, surveyHeadersId, chiller, condenser, evaporator, coolingTower, BMSInstalled) => {
    return surveydb.addBuilding(buildingName, companyName, buildingType, buildingTypeId, address, postalCode, country, comment, userId, surveyHeadersId, chiller, condenser, evaporator, coolingTower, BMSInstalled);
}

const getBuildingType = () => {
    return surveydb.getBuildingType().then(data => {
        if (data.length) {
            data.pop()
            return data
        }
    });
}

module.exports = { addBuilding, getBuildingType }