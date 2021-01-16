const { gql } = require("apollo-server-express")
const postType = gql`
extend type Query{
    posts:[Post]!
    post(id:ID!):Post
}
type Post{
post:String!
file:String!
id:ID!
user:User!
comments:[Comment]
likes:[Like]
}

extend type Mutation{
    addPost(post:String!):Post
    editPost(post:String!,id:ID!):Post
    deletePost(post:String!,id:ID!):Post
}
`
module.exports=postType