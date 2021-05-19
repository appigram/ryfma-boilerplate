import gql from 'graphql-tag'

const unSavePost = gql`
  mutation unSavePost($_id: ID!, $userId: String!, $festPostId: String, $albums: [String]) {
    unSavePost(_id: $_id, userId: $userId, festPostId: $festPostId, albums: $albums)
  }
`

export default unSavePost
