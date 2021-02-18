const User = require("../../models/user")
const postResolver=require("./post")
const commentResolver=require("./comment")
const { AuthenticationError } = require("apollo-server-express")
const likeResolvers = require("./likes")
const check = me => {
 if (!me) {throw new AuthenticationError("please Login")}   
}
const userResolver = {
    Query: {
        users: async (parent, args, { me }, info) => {
            check(me)
            
            try {
                const users = await User.find()
                return users
            } catch (e) {
                return e
            }
        },
        user: async (parent, args, { me }, info) => {
              check(me)
            try {
                const user = await User.findById(args.id)
                return user
            } catch (e) {
                return e
            }
        },
        search:async (parent, args, { me }, info) => {
              check(me)
            try {
                const user = await User.find({ $text: { $search: args.name } })
                
                return  user 
            } catch (e) {
                return e
            }
        },
    },
    Mutation: {
        signUp: async (parent, args) => {
            const user = new User(args)
            try {
                const token = await user.setToken()
                return {token,id:user.id,name:user.name}
            }catch(e){return e}
        },
        signIn: async (parent, args) => {
            try {
                const user = await  User.logIn(args.email,args.password)
                const token = await user.setToken()
                return {token,id:user.id,name:user.name}
            }catch(e){return e}
        },
        signOut:async (parent, args, { me,post }, info) => {
              check(me)
            try {
                me.user.tokens=me.user.tokens.filter(token=>token.token!==me.token)
                await me.user.save()
                return me.user
            } catch (e) {
                return e
            }
        },
         signOutAll:async (parent, args, { me,post }, info) => {
              check(me)
            try {
                me.user.tokens=[]
                await me.user.save()
                return me.user
            } catch (e) {
                return e
            }
        },
          following:async (parent, args, { me,post }, info) => {
              check(me)
              try {
                  me.user.following = me.user.following.filter(follow => follow != args.id)
               
                  me.user.following.push(args.id)
                  await me.user.save()
                  const user = await User.findOne({ _id: args.id })
                  
                  user.followed = user.followed.filter(follow => follow != me.user._id.toString())
                
                  user.followed.push(me.user._id)
                  await user.save()
                
                return me.user
            } catch (e) {
                return e
            }
        },
          unfollow:async (parent, args, { me,post }, info) => {
              check(me)
            
              try {
           
                  me.user.following = me.user.following.filter(follow => follow != args.id)
                  await me.user.save()
                  const user = await User.findOne({ _id: args.id })
                  user.followed = user.followed.filter(follow => follow != me.user._id.toString())
                  await user.save()
                return {id:args.id}
            } catch (e) {
                return e
            }
        },
    },

    User: {
        posts:async (parent, args, { me,post }, info) => {
              check(me)
            try {
                const rPosts = await post.loadMany(parent.posts)
               
                return rPosts
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
    }
}
const resolvers=[userResolver,postResolver,commentResolver,likeResolvers]
module.exports = {resolvers,check }