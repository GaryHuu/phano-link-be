const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  try {
    const bearerToken = req.header('Authorization')
    if (!bearerToken) {
      return res.status(401).json({ msg: 'Invalid Authentication1' })
    }

    const token = bearerToken.split(' ')[1]

    if (!token) return res.status(401).json({ msg: 'Invalid Authentication' })
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(401).json({ msg: 'Invalid Authentication' })

      req.user = user
      next()
    })
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
}

module.exports = auth
