import gql from 'graphql-tag'

const getNextPrevPosts = gql`
  query getNextPrevPosts($postId: ID!) {
    getNextPrevPosts(postId: $postId) {
      _id
      createdAt
      postedAt
      title
      coverImg
      excerpt
      slug
      author {
        _id
        username
        profile {
          name
          image
        }
      }
    }
  }
`

export default getNextPrevPosts
