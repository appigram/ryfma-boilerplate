import gql from 'graphql-tag'

const deletePost = gql`
  mutation deletePost($_id: ID!, $albumId: String, $userId: String, $username: String, $isBulk: Boolean) {
    deletePost(
      _id: $_id,
      albumId: $albumId,
      userId: $userId,
      username: $username,
      isBulk: $isBulk
    )
  }
`

export default deletePost
