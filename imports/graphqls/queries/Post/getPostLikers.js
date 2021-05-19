import gql from 'graphql-tag'

const getPostLikers = gql`
  query getPostLikers($postId: ID!, $festId: String, $skip: Int, $limit: Int) {
    getPostLikers(postId: $postId, festId: $festId, skip: $skip, limit: $limit)
  }
`

export default getPostLikers
