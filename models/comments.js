const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    comment: { type: String, required: true, trim: true },
    owner: { type: mongoose.SchemaTypes.ObjectId, ref: "Users" },
    post: { type: mongoose.SchemaTypes.ObjectId, ref: "Posts" },
    
},{timestamps:true})
const Comments = mongoose.model("Comments", schema)
module.exports=Comments