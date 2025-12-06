const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invChecks = require("../utilities/inventory-validation");
const auth = require("../utilities/authorization"); 
const { checkAccountType } = require("../utilities/authorization")

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:id", utilities.handleErrors(invController.buildDetail));

router.get("/broken", utilities.handleErrors(invController.throwError));

router.get(
  "/",
  checkAccountType, 
  utilities.handleErrors(invController.buildManagementView)
)

router.get(
  "/newClassification",
  auth.checkAccountType,
  utilities.handleErrors(invController.newClassificationView)
);

router.post(
  "/addClassification",
  auth.checkAccountType,
  invChecks.classificationRule(),
  invChecks.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

router.get(
  "/newVehicle",
  auth.checkAccountType,
  utilities.handleErrors(invController.newInventoryView)
);

router.post(
  "/addInventory",
  auth.checkAccountType,
  invChecks.newInventoryRules(),
  invChecks.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

router.get("/edit/:inv_id", auth.checkAccountType, utilities.handleErrors(invController.editInvItemView));
router.post("/update", auth.checkAccountType, utilities.handleErrors(invController.updateInventory));
router.get("/delete/:inv_id", auth.checkAccountType, utilities.handleErrors(invController.deleteView));
router.post("/delete", auth.checkAccountType, utilities.handleErrors(invController.deleteItem));

module.exports = router;
