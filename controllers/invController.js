const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { validationResult } = require("express-validator")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId // Make sure your route param matches this
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  let className = "Unknown Classification"
  if (data.length > 0) {
    className = data[0].classification_name
  }
  res.render(".inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 *  Assignment 3, Task 1
 * ************************** */
invCont.buildDetail = async function (req, res, next) {
  const invId = req.params.id
  let vehicle = await invModel.getInventoryById(invId)
  const htmlData = await utilities.buildSingleVehicleDisplay(vehicle)
  let nav = await utilities.getNav()
  const vehicleTitle =
    vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model
  res.render("./inventory/detail", {
    title: vehicleTitle,
    nav,
    message: null,
    htmlData,
  })
}

/* ***************************
 *  Build add classification form
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Process add classification form
 * ************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const errors = validationResult(req)
  let nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
      classification_name,
    })
    return
  }

  const result = await invModel.addClassification(classification_name)
  if (result) {
    req.flash("notice", `Classification "${classification_name}" added.`)
    res.redirect("/inv")
  } else {
    req.flash("notice", "Classification addition failed.")
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res) {
  let nav = await utilities.getNav()
  let message = req.flash("notice") // returns an array of messages
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    message,
  })
}

/* ***************************
 *  Build add inventory form
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
  })
}

/* ***************************
 *  Process add inventory form
 * ************************** */
invCont.addInventory = async function (req, res) {
  const errors = validationResult(req)
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(
    req.body.classification_id
  )

  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: errors.array(),
      ...req.body,
    })
  }

  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    inv_thumbnail,
    inv_image,
  } = req.body

  // Provide default images if none provided
  const defaultThumbnail = "/images/vehicles/no-image-available.png"
  const defaultImage = "/images/vehicles/no-image-available.png"

  const result = await invModel.addInventoryItem({
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    inv_thumbnail: inv_thumbnail || defaultThumbnail,
    inv_image: inv_image || defaultImage,
  })

  if (result) {
    req.flash("notice", `${inv_make} ${inv_model} added successfully.`)
    res.redirect("/inv")
  } else {
    req.flash("notice", "Failed to add the vehicle.")
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
      ...req.body,
    })
  }
}

/* ****************************************
 *  Process intentional error
 *  Assignment 3, Task 3
 * ************************************ */
invCont.throwError = async function (req, res) {
  throw new Error("I am an intentional error")
}

module.exports = invCont
