import gql from 'graphql-tag'

const getPostInfo = gql`
  query getPostInfo($postId: ID!, $noCache: Boolean) {
    getPost(postId: $postId, noCache: $noCache) {
      _id
      createdAt
      postedAt
      title
      slug
      seoTitle
      excerpt
      htmlBody
      currUserLikes
      coins
      likeCount
      liked
      viewCount
      savedCount
      saved
      commentsCount
      giftsCount
      userId
      coverImg
      videoLink
      fests
      paymentType
      isPromoted
      isBought
      isCertified
      isAdultContent
      isBlocked
      isEditorsPick
      audios
      status
      redirectTo
      albums
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
      inFests {
        _id
        slug
        title
        isDuel
      }
      gifts {
        gifts {
          giftId
          countGifts
        }
      }
      author {
        _id
        username
        isFollowing
        isClassic
        isSponsorPaused
        coins
        roles
        tariffs
        emails {
          verified
        }
        profile {
          name
          image
          twitterUser
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

export default getPostInfo
