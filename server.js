/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()

const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require("./database/")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const flash = require("connect-flash")
const pgSession = require("connect-pg-simple")(session)

/* ***********************
 * Session Middleware
 *************************/
app.use(
  session({
    store: new pgSession({
      pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, 
      secure: false, 
    },
    name: "sessionId",
  })
)

/* ***********************
 * Flash Messages
 *************************/
app.use(flash())
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

/* ***********************
 * Body Parsers
 *************************/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

/* ***********************
 * View Engine
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Logged-in user local variable
 *************************/
app.use((req, res, next) => {
  res.locals.user = req.session.user || null
  next()
})

/* ***********************
 * Routes
 *************************/
app.use(static)

app.get("/", utilities.handleErrors(baseController.buildHome))

app.use("/inv", inventoryRoute)

app.use("/account", accountRoute)

/* ***********************
 * 404 Handler
 *************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ***********************
 * Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at "${req.originalUrl}": ${err.message}`)

  const message =
    err.status == 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?"

  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ***********************
 * Server
 *************************/
const port = process.env.PORT
const host = process.env.HOST

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
