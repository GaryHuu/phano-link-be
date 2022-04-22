const Users = require('../models/usersModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const usersController = {
  async register(req, res) {
    try {
      const { name, email, address, password, phone, gender } = req.body
      const userExist = await Users.findOne({ email })

      if (userExist) {
        return res.status(400).json({ msg: 'The email is already exist' }) //Check exist
      }

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: 'Password is at least 6 characters' })

      const passwordHash = await bcrypt.hash(password, 10)

      const newUser = new Users({
        name,
        email,
        address,
        password: passwordHash,
        phone,
        gender,
      })

      await newUser.save()

      res.status(200).json({
        msg: 'Register Sucessfully',
      })
    } catch (error) {
      return res.status(500).json({ msg: err.message })
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body

      const user = await Users.findOne({ email })
      if (!user) return res.status(400).json({ msg: 'User does not exist' })

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch)
        return res
          .status(400)
          .json({ msg: 'Sign in failed. Please try again!' })

      // If login success, create access token and refresh token
      const accesstoken = createAccessToken({ id: user._id })

      const resUser = JSON.parse(JSON.stringify(user))
      delete resUser.password
      delete resUser.createdAt
      delete resUser.updatedAt
      delete resUser.__v

      res.json({ accesstoken, user: resUser })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  async deleteAccount(req, res) {
    try {
      const userExist = await Users.findById(req.params.id)
      if (!userExist) return res.status(400).json({ msg: 'User is not exist' })

      await Users.findByIdAndDelete({ _id: req.params.id })
      res.json({ msg: 'Delete account user successfully!' })
    } catch (err) {
      return res.json({ msg: err })
    }
  },
}

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' })
}

module.exports = usersController
