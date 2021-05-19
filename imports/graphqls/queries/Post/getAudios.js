import gql from 'graphql-tag'

const getAudios = gql`
  query getAudios($type: String, $userId: String, $albumId: String, $tagId: String, $festId: String, $duration: String, $withImage: Boolean, $personal: Boolean, $isAudio: Boolean, $skip: Int, $limit: Int) {
    audios(type: $type, userId: $userId, albumId: $albumId, tagId: $tagId, festId: $festId, duration: $duration, withImage: $withImage, personal: $personal, isAudio: $isAudio, skip: $skip, limit: $limit) {
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
      promo {
        currentViews
        status
      }
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

export default getAudios
