const { gql } = require("apollo-server-express")
const commentType = gql`
extend type Query{
    comments:[Comment]
    comment(id:ID!):Comment
}
type Comment{
comment:String!
createdAt:String!
user:User!
id:ID!
}

extend type Mutation{
    addComment(comment:String!,postid:ID!):Comment
    editComment(post:String!,id:ID!):Comment
    deleteComment(post:String!,id:ID!):Comment
}
`
module.exports=commentType