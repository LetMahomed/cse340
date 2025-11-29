const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")

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
 * Build add-classification View Route
 **************************************** */
router.get(
 "/newClassification"
)
/* ****************************************
 * Process add-classification Route
 **************************************** */
router.post(
  "/addClassification"
) 
/* ****************************************
 * Build add-vehicle View Route
 **************************************** */
router.get(
  "/newVehicle",
)
/* ****************************************
 * Process add-vehicle Route
 **************************************** */
router.post(
  "/addInventory",
)
module.exports = router;