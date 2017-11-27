import React from 'react'
import { translate } from 'react-i18next'
import Loader from '../Common/Loader'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import UserInfoItem from '../Users/UserInfoItem'
import EmptyBlock from '../Common/EmptyBlock'
import store from '/lib/store'

class SearchUsersResult extends React.Component {
  render () {
    const { t } = this.props
    const { loading, error, searchUsers } = this.props.data

    if (loading) {
      return <Loader />
    }

    if (error) {
      return <div>Error: {error.reason}</div>
    }
    const currUserId = store.getItem('Meteor.userId')
    return (
      <div>
        { searchUsers.length > 0
          ? searchUsers.map((user) =>
            <UserInfoItem user={user} itsme={currUserId === user._id} />
          )
          : <EmptyBlock iconName='users' header={t('common:search.emptyUserHeader')} text={t('common:search.emptyUserText')} />
        }
      </div>
    )
  }
}

const searchUsers = gql`
  query searchUsers($keyword: String!, $limit: Int) {
    searchUsers(keyword: $keyword, limit: $limit) {
      _id
      username
      isFollowing
      profile {
        name
        bio
        image
      }
    }
  }
`

const SearchUsersResultWithData = graphql(searchUsers, {
  options: (ownProps) => ({
    variables: {
      keyword: ownProps.keyword,
      limit: 100
    },
    activeCache: true
  })
})(SearchUsersResult)

export default translate()(withRouter(SearchUsersResultWithData))
