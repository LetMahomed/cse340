// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const {
  addClassificationRules,
  addInventoryRules,
  checkInventoryData
} = require("../utilities/inventory-validation")

router.get("/type/:classificationId", invController.buildByClassificationId)

router.get("/", invController.buildManagement)

router.get("/add-inventory", invController.buildAddInventory)

router.post(
  "/add-inventory",
  addInventoryRules(),
  checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

router.get("/detail/:id", 
  utilities.handleErrors(invController.buildDetail))

router.get("/add-classification", invController.buildAddClassification)

router.get("/broken",
  utilities.handleErrors(invController.throwError))

router.post(
  "/add-classification",
  addClassificationRules(),
  utilities.handleErrors(invController.addClassification)
)

module.exports = router
