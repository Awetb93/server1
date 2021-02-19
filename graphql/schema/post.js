const { gql } = require("apollo-server-express")
const postType = gql`
scalar Upload
extend type Query{
    posts:[Post]!
    post(id:ID!):Post
}
type Post{
post:String
picUrl:String
picName:String
id:ID!
user:User!
comments:[Comment]
likes:[Like]
createdAt:String
}
extend type Mutation{
    addPost(post:String,file:Upload):Post
    editPost(post:String!,id:ID!):Post
    deletePost(id:ID!):Post
}
`
module.exports=postType