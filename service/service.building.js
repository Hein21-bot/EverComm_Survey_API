const { surveydb } = require('../db')

const getBuilding = () => {
    return surveydb.getBuilding();
}

const addBuilding = (buildingName, companyName, address, postalCode, country, comment) => {
    return surveydb.addBuilding(buildingName, companyName, address, postalCode, country, comment);
}

module.exports = { getBuilding, addBuilding }