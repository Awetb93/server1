const Post = require("../../models/posts")
const { AuthenticationError } = require("apollo-server-express")
const check = me => {
 if (!me) {throw new AuthenticationError("please Login")}   
}
const resolvers = {
     Query:{
        posts:async (parent, args, { me }, info) => {
            check(me)
             try {
                 const posts = await Post.find()
                return posts
            } catch (e) {
                return e
            }
        },
         post:async (parent, args, { me }, info) => {
            check(me)
            try {
                const post = await Post.findById(args.id)
                return post
            } catch (e) {
                return e
            }
        },
    },
    Mutation: {
        addPost:async (parent, args, { me }, info) => {
            check(me)
            const post = new Post({...args,user:me.user._id})
            try {
                me.user.posts.push(post._id)
                await post.save()
                await me.user.save()
                return post
            } catch (e) {
                return e
            }
        },
    },
    Post: {
        user:async (parent, args, { me,users }, info) => {
            check(me)
        
            try {
               const userPost = await users.load(parent.user)
                return userPost
            } catch (e) {
                return e
            }
        },
        comments:async (parent, args, { me, comments }, info) => {
            check(me)
        
            try {
               const userPost = await  comments.loadMany(parent.comments)
                return userPost
            } catch (e) {
                return e
            }
        },
        likes:async (parent, args, { me, likes }, info) => {
            check(me)
        
            try {
               const like = await  likes.loadMany(parent.likes)
                return like
            } catch (e) {
                return e
            }
        },
    }
}
module.exports=resolvers