import gql from 'graphql-tag'

const getGiftsInfo = gql`
  query getGiftsInfo($objectId: ID!, $objectType: String, $skip: Int, $limit: Int) {
    getGiftsInfo(objectId: $objectId, objectType: $objectType, skip: $skip, limit: $limit)
  }
`

export default getGiftsInfo
