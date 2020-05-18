const express = require("express")
const router = express.Router();
const { buildingController } = require('../controller')

// router.get('/', buildingController.getBuilding);
router.post('/addBuilding', buildingController.addBuilding);
router.put('/updateBuilding', buildingController.updateBuilding)

module.exports = router