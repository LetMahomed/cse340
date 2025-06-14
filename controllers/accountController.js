const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
const buildLogin = async (req, res) => {
  const nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
};

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", { 
    title: "Register",
    nav,
    errors: null,
  });
}


/* ****************************************
*  Deliver My Account page (optional)
* *************************************** */
const buildAccount = async (req, res) => {
  const nav = await utilities.getNav();
  res.render("account/account", {
    title: "My Account",
    nav,
  });
};

/* ****************************************
*  Process Registration
* *************************************** */
async function accountRegister(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.accountRegister(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(accountRegister, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

}

module.exports = {buildLogin, buildRegister, buildAccount, accountRegister};
