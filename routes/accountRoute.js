// Import required modules
const express = require("express");
const router = express.Router();
const regValidate = require('../utilities/account-validation')


// Import utilities (for example, error handling middleware)
const utilities = require("../utilities");

// Import the accounts controller
const accountController = require("../controllers/accountController");

// Route for login page
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)
router.get(
  "/register",
  (req, res, next) => {
    console.log("✅ /account/register route reached");
    next();
  },
  utilities.handleErrors(accountController.buildRegister)
);

// Route for "My Account" page
router.get(
  "/", 
  utilities.handleErrors(accountController.buildAccount)
);
// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.accountRegister)
)
// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)






module.exports = router;
