const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const Jwt = require("jsonwebtoken")
const schema = new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true,unique:true},
    password:{type:String,required:true,trim:true},
    tokens: [{ token: { type: String, required: true, trim: true } }],
    posts: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Posts" }],
    followed:[{ type: mongoose.SchemaTypes.ObjectId,}],
    following:[{ type: mongoose.SchemaTypes.ObjectId,}],
    
}, { timestamps: true })
schema.index({name:'text'})
schema.pre('save', async function (next) {
    const user = this
    if (user.isModified("password")) {
        user.password=await bcrypt.hash(user.password,10)
    }
    next()
})
schema.statics.logIn = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) { throw new Error("please logIn") }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) { throw new Error("please logIn") }
    return user
}
schema.methods.setToken = async function () {
    const user = this
    const token = await Jwt.sign({_id: user._id.toString()}, process.env.sec)
    user.tokens = [...user.tokens, { token }]
    await user.save()
    return token
}
const User = mongoose.model("Users", schema)
module.exports=User