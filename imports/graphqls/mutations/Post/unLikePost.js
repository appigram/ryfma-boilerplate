import gql from 'graphql-tag'

const unLikePost = gql`
  mutation unLikePost($_id: ID!, $userId: String!, $likes: Int) {
    unLikePost(
      _id: $_id,
      userId: $userId,
      likes: $likes
    )
  }
`

export default unLikePost
