const User = require("../models/user")
const Jwt = require("jsonwebtoken")
const auth = async (req) => {
    let isAuthorized
    try {
        const token = req.headers.authorization.replace("Bearer ", "")
        if (!token) {
            return isAuthorized=false
        }
        const valid = Jwt.verify(token, process.env.sec)
        if (!valid) {
            return isAuthorized=false
        }
        const user = await User.findOne({ _id: valid._id, "tokens.token": token })
        if (!user) {
            return isAuthorized=false
        }
        return {
            isAuthorized: true,
            token,
            user
            
        }
     } catch (e) {
        return isAuthorized=false
    }
}
module.exports=auth