const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities") 

// Login
router.get("/login", accountController.buildLogin)
router.post("/login", accountController.loginAccount)

// Register
router.get("/register", accountController.buildRegister)
router.post("/register", accountController.registerAccount)

// Account dashboard
router.get("/", accountController.buildAccount)

// Logout
router.get("/login", accountController.logout)

// Update account
router.get("/update/:id", accountController.buildUpdateAccount) // show update form
router.post("/update/:id", utilities.handleErrors(accountController.updateAccount)) // process update

module.exports = router
