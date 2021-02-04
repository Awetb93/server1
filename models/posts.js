const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    post: { type: String, required: true, trim: true },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "Users" },
    comments:[{type:mongoose.SchemaTypes.ObjectId,ref:"Comments"}],
    likes:[{type:mongoose.SchemaTypes.ObjectId,ref:"Likes"}]
},{timestamps:true})
const Post = mongoose.model("Posts", schema)
module.exports=Post