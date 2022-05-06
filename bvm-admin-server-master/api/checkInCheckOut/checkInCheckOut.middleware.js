const jwt = require('jsonwebtoken')
const verifyToken = (req, res, next) => {

    const token = req.headers.authorization;
    if (!token) return res.status(403).send({ success: false, message: "No token provided." })

    req.userId = jwt.decode(token).id
    next();
}
module.exports = verifyToken