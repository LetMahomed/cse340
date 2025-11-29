// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invChecks = require("../utilities/inventory-validation")

router.get("/type/:classificationId", invController.buildByClassificationId);


/* ****************************************
 * Route to build vehicle detail view
 **************************************** */
router.get("/detail/:id", 
utilities.handleErrors(invController.buildDetail))

/* ****************************************
 * Error Route
 **************************************** */
router.get(
  "/broken",
  utilities.handleErrors(invController.throwError)
)

/* ****************************************
 * Build Management View Route
 **************************************** */
router.get(
  "/",
  //utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagementView)
)

/* ****************************************
 * Build add-classification View Route
 **************************************** */
router.get(
  "/newClassification",
  utilities.handleErrors(invController.newClassificationView)
)


/* ****************************************
 * Process add-classification Route
 **************************************** */
router.post(
  "/addClassification",
  invChecks.classificationRule(),
  invChecks.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

/* ****************************************
 * Build add-vehicle View Route
 **************************************** */
router.get(
  "/newVehicle",
  utilities.handleErrors(invController.newInventoryView)
)

/* ****************************************
 * Process add-vehicle Route
 **************************************** */
router.post(
  "/addInventory",
  invChecks.newInventoryRules(),
  invChecks.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)


module.exports = router;