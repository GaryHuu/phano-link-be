const express = require('express')
const usersController = require('../controllers/usersController')
const auth = require('../middlewares/authen')
const authAdmin = require('../middlewares/authenAdmin')

const router = express.Router()

router.post('/register', usersController.register)
router.post('/login', usersController.login)
router.delete(
  '/deleteAccount/:id',
  auth,
  authAdmin,
  usersController.deleteAccount
)
router.patch('/update', auth, usersController.updateInformation)
router.patch('/update/address', auth, usersController.updateAddress)

module.exports = router
