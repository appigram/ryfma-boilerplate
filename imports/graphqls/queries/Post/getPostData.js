import gql from 'graphql-tag'

const getPostData = gql`
  query getPostData($postId: ID!, $noCache: Boolean) {
    getPost(postId: $postId, noCache: $noCache) {
      _id
      createdAt
      postedAt
      scheduledAt
      title
      slug
      status
      htmlBody
      excerpt
      paymentType
      coins
      viewCount
      lastCommentedAt
      clickCount
      status
      sticky
      userId
      coverImg
      videoLink
      videoId
      audios
      tags {
        _id
        name
      }
      fests
      albumId
      isCertified
      isAdultContent
      isEditorsPick
    }
  }
`

export default getPostData
