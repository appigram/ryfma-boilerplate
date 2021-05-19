import gql from 'graphql-tag'

const getLatestPostsShort = gql`
  query getLatestPosts($type: String, $userId: String, $albumId: String, $tagId: String, $festId: String, $duration: String, $withImage: Boolean, $status: Int, $personal: Boolean, $keyword: String, $noCache: Boolean, $skip: Int, $limit: Int) {
    posts(type: $type, userId: $userId, albumId: $albumId, tagId: $tagId, festId: $festId, duration: $duration, withImage: $withImage, status: $status, personal: $personal, keyword: $keyword, noCache: $noCache, skip: $skip, limit: $limit) {
      _id
      createdAt
      postedAt
      title
      seoTitle
      slug
      coverImg
      videoLink
      likeCount
      commentsCount
      viewCount
      videoLink
      audioFiles
      albumId
      album {
        _id
        title
        slug
      }
      tags {
        _id
        name
        slug
      }
      author {
        _id
        username
        tariffs
        profile {
          image
          name
        }
      }
    }
  }
`

export default getLatestPostsShort
