import gql from 'graphql-tag'

const likePost = gql`
  mutation likePost(
    $_id: ID!
    $title: String!
    $userId: String!
    $likes: Int!
    $totalLikes: Int!
  ) {
    likePost(
      _id: $_id
      title: $title
      userId: $userId
      likes: $likes
      totalLikes: $totalLikes
    )
  }
`

export default likePost
