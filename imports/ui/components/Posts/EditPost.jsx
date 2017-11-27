import React from 'react'
import { translate } from 'react-i18next'
import {Notification} from '../Notification/Notification'
import NotFound from '/imports/ui/pages/NotFound'
import Loader from '../Common/Loader'
import EditorWrapper from './EditorWrapper'
import store from '/lib/store'
import { graphql, compose } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import ReactGA from 'react-ga'

class EditPost extends React.Component {
  async delete (postId) {
    try {
      await this.props.deletePost({ _id: postId })
      Notification.success(this.props.t('common:notif.postDeleted'))
      store.setItem('ryfmaContentTitle', '')
      store.setItem('ryfmaContentState', '')
      store.setItem('ryfmaContentTags', '')
      store.setItem('ryfmaContentMetaContext', '')
      ReactGA.event({
        category: 'User',
        action: 'PostDeleted'
      })
      this.props.history.push('/?refresh')
    } catch (error) {
      Notification.error(error)
    }
  }

  async update (params) {
    const updateParams = {
      _id: this.props.match.params.postId,
      ...params
    }
    try {
      await this.props.updatePost(updateParams)
      Notification.success(this.props.t('common:notif.postUpdated'))
      store.setItem('ryfmaContentTitle', '')
      store.setItem('ryfmaContentState', '')
      store.setItem('ryfmaContentTags', '')
      store.setItem('ryfmaContentMetaContext', '')
      this.props.history.push(`/p/${this.props.match.params.postId}?refresh`)
    } catch (error) {
      Notification.error(error)
    }
  }

  render () {
    if (this.props.getPostData.loading) {
      return <Loader />
    }

    if (this.props.getPostData.error) {
      return <NotFound />
    }

    return (
      <EditorWrapper
        postData={this.props.getPostData.getPost}
        deletePost={this.delete.bind(this)}
        updatePost={this.update.bind(this)}
       />
    )
  }
}

const getPostData = gql`
  query getPostData($postId: ID!) {
    getPost(postId: $postId) {
      _id
      postedAt
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
      tags {
        _id
        name
      }
    }
  }
`

const deletePost = gql`
  mutation deletePost($_id: ID!) {
    deletePost(
      _id: $_id
    )
  }
`

const updatePost = gql`
  mutation updatePost(
    $_id: ID!,
    $title: String!,
    $slug: String!,
    $htmlBody:  String!,
    $excerpt: String!,
    $status: String!,
    $sticky: Boolean,
    $coverImg: String,
    $tags: [String]!,
  ) {
    updatePost(
      _id: $_id,
      title: $title,
      slug: $slug,
      htmlBody: $htmlBody,
      excerpt: $excerpt,
      status: $status,
      sticky: $sticky,
      coverImg: $coverImg,
      tags: $tags,
    )
  }
`

const EditPostWithData = compose(
  graphql(getPostData, {
    options: (ownProps) => ({
      variables: {
        postId: ownProps.match.params.postId
      }
    }),
    name: 'getPostData',
    fetchPolicy: 'network-only'
  }),
  graphql(updatePost, {
    props ({ mutate }) {
      return {
        updatePost (postVariables) {
          return mutate({ variables: postVariables })
        }
      }
    }
  }),
  graphql(deletePost, {
    props ({ mutate }) {
      return {
        deletePost ({ _id }) {
          return mutate({ variables: { _id } })
        }
      }
    }
  })
)(EditPost)

export default translate()(withRouter(EditPostWithData))
