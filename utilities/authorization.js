function checkAccountType(req, res, next) {
    if (!req.session.user) {
      req.flash("notice", "Please log in.")
      return res.redirect("/account/login")
    }
  
    const type = req.session.user.account_type
  
    if (type === "Employee" || type === "Admin") {
      return next()
    }
  
    req.flash("notice", "You do not have permission to view this page.")
    return res.redirect("/account/login")
  }
  
  module.exports = { checkAccountType }
  