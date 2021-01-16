const { gql } = require("apollo-server-express")
const postType = require("./post")
const commentType=require("./comments")
const likeType = require("./likes")
const userType = gql`
type Query{
    users:[User]
    user(id:ID!):User
}
type User{
    name:String!
    email:String!
    id:ID!
    posts:[Post]!
    comments:[Comment]!
}
type Token{
    token:String!
    name:String!
    id:ID!
}
type Mutation{
    signUp( name:String!,email:String!,password:String!):Token
    signIn( email:String!,password:String!):Token
    signOut:User
    following(id:ID!):User
    unfollow(id:ID!):User
    block(id:ID!):User
    signOutAll:User
}
`
module.exports=[userType,postType,commentType,likeType]
