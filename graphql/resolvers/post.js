const id = require("uuid").v4()
const Aws=require("aws-sdk")
const Post = require("../../models/posts")
const { AuthenticationError } = require("apollo-server-express")
const {GraphQLUpload}=require("graphql-upload")
const Mongoose = require("mongoose")
const Comments = require("../../models/comments")
const Likes = require("../../models/likes")
Aws.config.update({region:"us-east-1"})
const S3=new Aws.S3({region:"us-east-1"})
const s3DefaultParams = {
  ACL: 'public-read',
  Bucket:process.env.BuketName,
  Conditions: [
    ['content-length-range', 0, 1024000], 
    { acl: 'public-read' },
  ],
};
const check = me => {
 if (!me) {throw new AuthenticationError("please Login")}   
}
const resolvers = {
    Upload:GraphQLUpload,
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
            try {
               if (args.file) {
                   const { filename, createReadStream } = await args.file
                   S3.upload({ ...s3DefaultParams, Body: createReadStream(), Key: `${id} ${filename}` }, async(err, data) => {
                       if (err) {
                    throw err
                       }
                       else {    
                 const name=data.Key.split(" ")
                const post = new Post({post:args.post,user:me.user._id,picUrl:data.Location,picName:name[1]})
                me.user.posts.push(post._id)
                await post.save()
                await me.user.save()
                return post
                       }
            })
          
                }  
                
               else {
                const post = new Post({...args,user:me.user._id})
                me.user.posts.push(post._id)
                await post.save()
                await me.user.save()
                return post
         
                }
            }
            catch (e) {
                return e
            }
        },
         deletePost:async (parent, args, { me }, info) => {
            check(me)
            try {
                const post = await Post.findByIdAndDelete(args.id)
                me.user.posts = me.user.posts.filter(post => post != args.id)
                const comments = await Comments.deleteMany({post:args.id})
                const likes = await Likes.deleteMany({ post: args.id })
                await me.user.save()
                return post
            
                }  
                
               
            
            catch (e) {
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