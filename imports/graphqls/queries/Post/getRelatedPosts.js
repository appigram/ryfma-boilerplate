import gql from 'graphql-tag'

const getRelatedPosts = gql`
  query getRelatedPosts($postId: ID!, $tags: [String]) {
    relatedPosts(postId: $postId, tags: $tags) {
      _id
      title
      coverImg
      slug
      tags {
        _id
        name
      }
      author {
        _id
        username
        roles
        profile {
          name
          image
        }
      }
    }
  }
`

export default getRelatedPosts
