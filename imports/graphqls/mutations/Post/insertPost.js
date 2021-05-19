import gql from 'graphql-tag'

const insertPost = gql`
  mutation insertPost(
    $title: String!,
    $slug: String!,
    $seoTitle: String,
    $htmlBody:  String!,
    $excerpt: String!,
    $paymentType: Int,
    $coins: Int,
    $scheduledAt: String,
    $status: Int!,
    $sticky: Boolean,
    $coverImg: String,
    $videoLink: String,
    $tags: [String]!,
    $albumId: String,
    $isCertified: Boolean,
    $isAdultContent: Boolean,
    $audioFiles: String,
    $ownerId: ID
  ) {
    insertPost(
      title: $title,
      slug: $slug,
      seoTitle: $seoTitle,
      htmlBody: $htmlBody,
      paymentType: $paymentType,
      coins: $coins,
      excerpt: $excerpt,
      scheduledAt: $scheduledAt,
      status: $status,
      sticky: $sticky,
      coverImg: $coverImg,
      videoLink: $videoLink,
      tags: $tags,
      albumId: $albumId,
      isCertified: $isCertified,
      isAdultContent: $isAdultContent,
      audioFiles: $audioFiles,
      ownerId: $ownerId
    ){
      _id
    }
  }
`

export default insertPost
