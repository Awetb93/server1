const Post = require("../../models/posts")
const Comments=require("../../models/comments")
const { AuthenticationError } = require("apollo-server-express")
const check = me => {
 if (!me) {throw new AuthenticationError("please Login")}   
}
const resolvers = {
     Query:{
        comments:async (parent, args, { me }, info) => {
            check(me)
             try {
                 const comments = await Comments.find()
                return comments
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
        addComment:async (parent, args, { me }, info) => {
            check(me)
            const comment = new Comments({...args,owner:me.user._id,post:args.postid})
            try {
                const post = await Post.findById(args.postid)
                post.comments.push(comment._id)
                await comment.save()
                await post.save()
                return comment
            } catch (e) {
                return e
            }
        },
    },
    Comment: {
       user:async (parent, args, { me,users }, info) => {
            check(me)
        
            try {
               const user = await users.load(parent.owner)
                return user
            } catch (e) {
                return e
            }
        },
    }
}
module.exports=resolvers