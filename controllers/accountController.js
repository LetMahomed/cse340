/* ************************************
 *  Account Controller
 *  Unit 4, deliver login view activity
 *  ******************************** */
const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken") 
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res) {
  let nav = await utilities.getNav();
  res.render("./account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/register", { 
    title: "Register",
    nav,
    errors: null,
  })
}
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  let hashedPassword
  try {
      hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("./account/register", {
          title: "Registration",
          nav,
          errors: null
      })
  }

  const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
  )

  if (regResult) {
      req.flash(
          "notice",
          `Congratulations, you\'re registered, ${account_firstname}. Please log in.`
      )
      res.status(201).render("./account/login", {
          title: "Login",
          nav,
          errors: null
      })
  } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("./account/register", {
          title: "Registration",
          nav,
          errors: null
      })
  }
}


async function loginAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    const accountData = await accountModel.checkExistingEmail(account_email);

    if (!accountData) {
      req.flash("notice", "Invalid email or password.");
      return res.status(400).render("./account/login", {
        title: "Login",
        nav,
        errors: null,
      });
    }

    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);

    if (!passwordMatch) {
      req.flash("notice", "Invalid email or password.");
      return res.status(400).render("./account/login", {
        title: "Login",
        nav,
        errors: null,
      });
    }

    req.session.user = {
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_email: accountData.account_email,
    };

    return res.redirect("/account/loggedin");
  } catch (error) {
    return next(error);
  }
}



module.exports = { buildLogin,buildRegister,registerAccount, loginAccount}