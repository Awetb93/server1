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
            let likes = await Likes.findOne({post:args.postid})
            let post = await Post.findById(args.postid)
            try {
                if (!likes) {
                let like = new Likes({like:args.like,post:args.postid})
                like.owner.push(me.user._id)
                post.likes.push(like._id)
                await like.save()
                await post.save()
                await me.user.save()
                return like
                }
                if (likes.owner.length > 0) {
                    if (likes.owner.includes(me.user._id)) {
                        likes.owner = likes.owner.filter(element => element != me.user._id.toString());
                        if (likes.owner.length < 1) {
                            post.likes = post.likes.filter(element => element != likes._id.toString())
                            await likes.remove()
                            await post.save()
                            return likes
                        }
                        await likes.save()
                        return likes
                    } 
                    likes.owner.push(me.user._id)
                    await likes.save()
                     return likes
                 }
                
            } catch (e) {
                return e
            }
        },
    }
}
module.exports=likeResolvers