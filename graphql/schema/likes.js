const { gql } = require("apollo-server-express")
const likeType = gql`
extend type Query{
    likes:[Like]
    like(id:ID!):Like
}
type Like{
like:Boolean!
owner:[ID]
id:ID!
}

extend type Mutation{
    addLike(like:Boolean!,postid:ID!):Like
}
`
module.exports=likeType