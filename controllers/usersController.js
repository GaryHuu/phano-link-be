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

      const resUser = validateUserRespone(user)

      res.json({ accesstoken, user: resUser })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  async deleteAccount(req, res) {
    try {
      const userExist = await Users.findById(req.user.id)
      if (!userExist) return res.status(400).json({ msg: 'User is not exist' })

      await Users.findByIdAndDelete({ _id: req.user.id })
      res.json({ msg: 'Delete account user successfully!' })
    } catch (err) {
      return res.json({ msg: err })
    }
  },
  async updateInformation(req, res) {
    try {
      const { name, phone, gender, birthday, password, newPassword } = req.body

      const user = await Users.findOne({ _id: req.user.id })
      if (!user) return res.status(400).json({ msg: 'User is not exist' })

      // change Password
      if (password && newPassword) {
        if (newPassword.length < 6) {
          return res
            .status(400)
            .json({ msg: 'New password must be least 6 character' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
          return res
            .status(400)
            .json({ msg: 'Password is wrong. Unable change pass' })

        const passwordHash = await bcrypt.hash(newPassword, 12)

        await Users.findOneAndUpdate(
          { _id: req.user.id },
          { password: passwordHash }
        )
      }

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        { name, phone, gender, birthday }
      )

      const data = await Users.findOne({ _id: req.user.id })
      const resUser = validateUserRespone(data)
      res.json({ msg: 'User has change successfully!', user: resUser })
    } catch (error) {
      return res.status(500).json({ msg: err.message })
    }
  },
  async updateAddress(req, res) {
    try {
      const { province, district, ward, street } = req.body

      const user = await Users.findOne({ _id: req.user.id })
      if (!user) return res.status(400).json({ msg: 'User is not exist' })

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        { address: { province, district, ward, street } }
      )

      const data = await Users.findOne({ _id: req.user.id })
      const resUser = validateUserRespone(data)
      res.json({ msg: 'Address has change successfully!', user: resUser })
    } catch (error) {}
  },
}

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' })
}

const validateUserRespone = (_user) => {
  const user = JSON.parse(JSON.stringify(_user))
  delete user.password
  delete user.createdAt
  delete user.updatedAt
  delete user.__v
  return user
}

module.exports = usersController
