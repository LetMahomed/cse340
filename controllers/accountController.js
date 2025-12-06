/* ************************************
 *  Account Controller
 ************************************ */
const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
require("dotenv").config()

/* ****************************************
 *  Deliver login view
 **************************************** */
async function buildLogin(req, res) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Deliver registration view
 **************************************** */
async function buildRegister(req, res) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Process Registration
 **************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  let hashedPassword

  try {
    hashedPassword = bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash("notice", `Congratulations, ${account_firstname}! You're registered.`)
    return res.redirect("/account/login")
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process Login
 **************************************** */
async function loginAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Invalid email or password.")
    return res.status(400).render("account/login", { title: "Login", nav, errors: null })
  }

  const match = await bcrypt.compare(account_password, accountData.account_password)

  if (!match) {
    req.flash("notice", "Invalid email or password.")
    return res.status(400).render("account/login", { title: "Login", nav, errors: null })
  }

  req.session.user = {
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_type: accountData.account_type,
  }

  req.session.loggedin = true

  req.flash("notice", `Welcome back, ${accountData.account_firstname}!`)

  const redirectTo = req.session.returnTo || "/account"
  delete req.session.returnTo

  return res.redirect(redirectTo)
}

/* ****************************************
 *  Deliver Account Management View
 **************************************** */
async function buildAccount(req, res) {
  let nav = await utilities.getNav()

  if (!req.session.user) {
    req.flash("notice", "Please log in to continue.")
    return res.redirect("/account/login")
  }

  const account = req.session.user

  res.render("account/account", {
    title: "Account Management",
    nav,
    account,           
    errors: null
  })
}


/* ***************************
 *  Logout user
 * *************************** */

async function logout(req, res) {
  req.flash("notice", "You have been logged out.");

  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.redirect("/");
    }
    res.clearCookie("sessionId"); s
    return res.redirect("/");
  });
}


/* ****************************************
 *  Show Update Account Form
 **************************************** */
async function buildUpdateAccount(req, res) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.id)

  if (!req.session.user || req.session.user.account_id !== account_id) {
    req.flash("notice", "You are not authorized to edit this account.")
    return res.redirect("/account")
  }

  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    accountData
  })

}

/* ****************************************
 *  Process Account Update
 **************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const errors = []

  if (!account_firstname || !account_lastname || !account_email) {
    errors.push("All fields are required.")
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (account_email && !emailRegex.test(account_email)) {
    errors.push("Please enter a valid email address.")
  }

  if (errors.length > 0) {
    const accountData = {
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    }

    return res.status(400).render("account/update", {
      title: "Update Account Information",
      nav,
      errors,
      accountData,
    })
  }

  try {
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )

    if (updateResult) {
      req.flash("notice", "Account updated successfully.")

      req.session.user.account_firstname = account_firstname
      req.session.user.account_lastname = account_lastname
      req.session.user.account_email = account_email

      return res.redirect("/account")
    } else {
      req.flash("notice", "Update failed.")
      const accountData = {
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      }

      return res.status(500).render("account/update", {
        title: "Update Account Information",
        nav,
        errors: ["Server error: could not update account."],
        accountData,
      })
    }
  } catch (error) {
    console.error("Error updating account:", error)
    req.flash("notice", "Update failed due to server error.")

    const accountData = {
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    }

    return res.status(500).render("account/update", {
      title: "Update Account Information",
      nav,
      errors: ["Server error: could not update account."],
      accountData,
    })
  }
}



module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  loginAccount,
  logout,
  buildAccount,
  buildUpdateAccount,
  updateAccount,
}
