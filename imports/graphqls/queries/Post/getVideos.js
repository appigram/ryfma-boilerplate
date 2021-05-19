import gql from 'graphql-tag'

const getVideos = gql`
  query getVideos($type: String, $userId: String, $albumId: String, $tagId: String, $festId: String, $duration: String, $withImage: Boolean, $personal: Boolean, $isVideo: Boolean, $skip: Int, $limit: Int) {
    videos(type: $type, userId: $userId, albumId: $albumId, tagId: $tagId, festId: $festId, duration: $duration, withImage: $withImage, personal: $personal, isVideo: $isVideo, skip: $skip, limit: $limit) {
      _id
      createdAt
      postedAt
      title
      slug
      excerpt
      coverImg
      videoLink
      isAdultContent
      paymentType
      coins
      isBought
      isPromoted
      userId
      coins
      likeCount
      commentsCount
      author {
        _id
        username
        roles
        isFollowing
        tariffs
        emails {
          verified
        }
        profile {
          name
          image
        }
      }
    }
  }
`

export default getVideos
