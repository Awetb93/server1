require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const DataLoader = require("dataloader")
const User=require("./models/user")
const Post=require("./models/posts")
const Comment=require("./models/comments")
const Likes=require("./models/likes")
const { ApolloServer } = require("apollo-server-express")
const typeDefs = require("./graphql/schema/user")
const { resolvers }=require("./graphql/resolvers/user")
const auth=require("./middleware/auth")
const port = process.env.PORT || 5000

const dispatchUser = async (keys, model) => {
    const users = await model.find({ _id: { $in: keys } })
    const user = keys.map(key => users.find(user=>user.id == key)) 

    return user
    
}
const dispatchPost = async (keys, model) => {
    const posts = await model.find({ _id: { $in: keys } })
    return posts
}

const server = new ApolloServer({
    typeDefs, resolvers, context: async ({ req }) => {
        const me = await auth(req)
        return {
            me,
            users: new DataLoader(keys => dispatchUser(keys,User )),
            post: new DataLoader(keys => dispatchPost( keys,Post)),
            comments: new DataLoader(keys => dispatchPost( keys,Comment)),
            likes: new DataLoader(keys => dispatchPost( keys,Likes)),
        }
} })
const app = express()
app.use(cors())
server.applyMiddleware({app})
const connect = async () => {
    try {
      await mongoose.connect(`mongodb+srv://admin123:${process.env.dbpassword}@cluster0.ipa6q.mongodb.net/${process.env.dbname}?retryWrites=true&w=majority`,{useCreateIndex:true,useFindAndModify:false,useNewUrlParser:true,useUnifiedTopology:true})
        console.log("db connected")  
        app.listen(port,()=>console.log("welcome"))
    } catch (e) {
        console.log(e)
    }
}
connect()
