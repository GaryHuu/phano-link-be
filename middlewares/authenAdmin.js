const Users = require('../models/usersModel')

const authAdmin = async (req, res, next) => {
  try {
    //Get user infor by id
    const user = await Users.findOne({ _id: req.user.id })
    if (user.role !== 'admin')
      return res
        .status(401)
        .json({ msg: 'Access denied. This is Admin systems' })
    next()
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
}
module.exports = authAdmin
