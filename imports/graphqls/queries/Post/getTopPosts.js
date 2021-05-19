import gql from 'graphql-tag'

const getTopPosts = gql`
  query getTopPosts {
    topPosts {
      _id
      title
      slug
      coverImg
      author {
        _id
        username
        profile {
          name
        }
      }
    }
  }
`

export default getTopPosts
