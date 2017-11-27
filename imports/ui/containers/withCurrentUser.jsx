import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const withCurrentUser = component => graphql(
  gql`
    query getCurrentUser {
      me {
        _id
        username
        emails {
          verified
        }
        profile {
          name
          firstname
          unreadNotifications
          image
        }
      }
    }
  `, {
    alias: 'withCurrentUser'
  }
)(component)

export default withCurrentUser
