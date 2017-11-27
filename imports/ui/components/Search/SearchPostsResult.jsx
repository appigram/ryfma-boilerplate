import React from 'react'
import { translate } from 'react-i18next'
import Loader from '../Common/Loader'
import PostsListItem from '../Posts/PostsListItem'
import EmptyBlock from '../Common/EmptyBlock'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'

class SearchPostsResult extends React.Component {
  render () {
    const { t } = this.props
    const { loading, error, searchPosts } = this.props.data

    if (loading) {
      return <Loader />
    }

    if (error) {
      return <div>Error: {error.reason}</div>
    }
    return (
      <div>
        { searchPosts.length > 0
          ? searchPosts.map((post) =>
            <PostsListItem key={post._id} post={post} />
          )
          : <EmptyBlock iconName='newspaper' header={t('common:search.emptyPostHeader')} text={t('common:search.emptyPostText')} />
        }
      </div>
    )
  }
}

const searchPosts = gql`
  query searchPosts($keyword: String!, $limit: Int) {
    searchPosts(keyword: $keyword, limit: $limit) {
      _id
      createdAt
      title
      slug
      htmlBody
      excerpt
      viewCount
      lastCommentedAt
      clickCount
      status
      sticky
      userId
      coverImg
      author {
        username
        profile {
          name
          image
        }
      }
    }
  }
`

const SearchPostsResultWithData = graphql(searchPosts, {
  options: (ownProps) => ({
    variables: {
      keyword: ownProps.keyword,
      limit: 100
    },
    activeCache: true
  })
})(SearchPostsResult)

export default translate()(withRouter(SearchPostsResultWithData))
