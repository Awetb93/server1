const Post = require("../../models/posts")
const Likes=require("../../models/likes")
const { AuthenticationError } = require("apollo-server-express")
const check = me => {
 if (!me) {throw new AuthenticationError("please Login")}   
}
const likeResolvers = {
     Query:{
        likes:async (parent, args, { me }, info) => {
            check(me)
             try {
                 const likes = await Likes.find()
                return likes
            } catch (e) {
                return e
            }
        },
         like:async (parent, args, { me }, info) => {
            check(me)
            try {
                const like = await Likes.findById(args.id)
                return like
            } catch (e) {
                return e
            }
        },
    },
    Mutation: {
        addLike:async (parent, args, { me }, info) => {
            check(me)
            const like = new Likes({...args,owner:me.user._id,post:args.postid})
            try {
                me.user.likes.push(like._id)
                const post = await Post.findById(args.postid)
                post.likes.push(like._id)
                await like.save()
                await post.save()
                await me.user.save()
                return like
            } catch (e) {
                return e
            }
        },
    }
}
module.exports=likeResolvers