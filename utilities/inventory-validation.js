const { body, validationResult } = require('express-validator')
const inventoryRules = {}


function checkClassName() {
  return body('classification_name')
    .trim()
    .notEmpty()
    .withMessage('Classification name is required')
    .isLength({ max: 50 })
    .withMessage('Classification name must be 50 characters or less')
}

// ✅ Add this function if you're adding inventory (e.g. make, model, price...)
function addInventoryRules() {
  return [
    body('inv_make')
      .trim()
      .notEmpty()
      .withMessage('Make is required'),

    body('inv_model')
      .trim()
      .notEmpty()
      .withMessage('Model is required'),

    body('inv_price')
      .trim()
      .notEmpty()
      .withMessage('Price is required')
      .isNumeric()
      .withMessage('Price must be a number'),

    // Add more fields as needed
  ]
}

function addClassificationRules() {
  return [
    checkClassName()
  ]
}

function checkInventoryData(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const nav = require("./index").getNav() // or wherever your getNav is
      return res.render("./inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        errors: errors.array(),
        message: null,
      })
    }
    next()
  }

  module.exports = {
    checkClassName,
    addClassificationRules,
    addInventoryRules,
    checkInventoryData // ✅ you must export it
  }
  