/* ***************************
 *  Account model
 * ************************** */

const pool = require("../database/")
const { get } = require("../routes/static")

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ])
  } catch (error) {
    console.error("registerAccount error:", error)
    return null
  }
}

/* **********************
 *  Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    return result.rowCount
  } catch (error) {
    console.error("checkExistingEmail error:", error)
    return null
  }
}

/* **********************
 *  Get account by email  (NEEDED FOR LOGIN)
 * ********************* */
async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    return result.rows[0] // return single account
  } catch (error) {
    console.error("getAccountByEmail error:", error)
    return null
  }
}

async function getAccountById(account_id) {
  try {
    const sql = "SELECT * FROM public.account WHERE account_id = $1"
    const values = [account_id]
    const result = await pool.query(sql, values)
    return result.rows[0] 
  } catch (error) {
    console.error("Error in getAccountById:", error)
    return null
  }
}
async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = `
      UPDATE public.account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *;
    `
    const values = [account_firstname, account_lastname, account_email, account_id]
    const result = await pool.query(sql, values)
    return result.rowCount > 0
  } catch (error) {
    console.error("Error in account-model updateAccount:", error)
    return false
  }
}
module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
}
