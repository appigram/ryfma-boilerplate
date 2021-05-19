import gql from 'graphql-tag'

const savePost = gql`
  mutation savePost($_id: ID!, $title: String, $userId: String!, $festPostId: String, $albums: [String]) {
    savePost(_id: $_id, title: $title, userId: $userId, festPostId: $festPostId, albums: $albums)
  }
`

export default savePost
