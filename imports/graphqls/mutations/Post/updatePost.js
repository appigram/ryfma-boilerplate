import gql from 'graphql-tag'

const updatePost = gql`
  mutation updatePost(
    $_id: ID!,
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
    $oldAlbumId: String,
    $isAdultContent: Boolean
    $isCertified: Boolean
    $audioFiles: String
    $ownerId: ID
  ) {
    updatePost(
      _id: $_id,
      title: $title,
      slug: $slug,
      seoTitle: $seoTitle,
      htmlBody: $htmlBody,
      excerpt: $excerpt,
      paymentType: $paymentType,
      coins: $coins,
      scheduledAt: $scheduledAt,
      status: $status,
      sticky: $sticky,
      coverImg: $coverImg,
      videoLink: $videoLink,
      tags: $tags,
      albumId: $albumId,
      oldAlbumId: $oldAlbumId,
      isCertified: $isCertified,
      isAdultContent: $isAdultContent,
      audioFiles: $audioFiles,
      ownerId: $ownerId
    )
  }
`

export default updatePost
