const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    like: { type: Boolean, required: true, },
    owner: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Users" }],
    post: { type: mongoose.SchemaTypes.ObjectId, ref: "Posts" },
    
})
const Likes = mongoose.model("Likes", schema)
module.exports=Likes