import gql from 'graphql-tag'

const getLatestPosts = gql`
  query getLatestPosts($type: String, $userId: String, $albumId: String, $tagId: String, $festId: String, $duration: String, $withImage: Boolean, $status: Int, $personal: Boolean, $keyword: String, $noCache: Boolean, $skip: Int, $limit: Int) {
    posts(type: $type, userId: $userId, albumId: $albumId, tagId: $tagId, festId: $festId, duration: $duration, withImage: $withImage, status: $status, personal: $personal, keyword: $keyword, noCache: $noCache, skip: $skip, limit: $limit) {
      _id
      createdAt
      postedAt
      title
      seoTitle
      slug
      excerpt
      coverImg
      videoLink
      audioFiles
      isAdultContent
      paymentType
      coins
      isBought
      isPromoted
      isEditorsPick
      userId
      albumId
      coins
      likeCount
      commentsCount
      viewCount
      promo {
        currentViews
        status
      }
      tags {
        _id
        name
        slug
      }
      album {
        _id
        title
        slug
      }
      author {
        _id
        username
        roles
        isFollowing
        isSponsorPaused
        tariffs
        emails {
          verified
        }
        profile {
          name
          image
        }
        stats {
          sponsorsCount
        }
        sponsors {
          username
          profile {
            image
            name
          }
        }
      }
    }
  }
`

export default getLatestPosts
