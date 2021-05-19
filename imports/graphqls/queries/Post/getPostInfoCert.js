import gql from 'graphql-tag'

const getPostInfoCert = gql`
  query getPostInfo($postId: ID!) {
    getPost(postId: $postId) {
      _id
      createdAt
      title
      slug
      userId
      author {
        _id
        profile {
          name
        }
      }
      certificate {
        _id
        uuid
        buyedAt
        buyedType
        status
      }
    }
  }
`

export default getPostInfoCert
