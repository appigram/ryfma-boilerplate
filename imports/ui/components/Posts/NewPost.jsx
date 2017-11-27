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
import withCurrentUser from '/imports/ui/containers/withCurrentUser'
import ReactGA from 'react-ga'

class NewPost extends React.Component {
  async insert (params) {
    try {
      const response = await this.props.insertPost(params)
      Notification.success(this.props.t('common:notif.postCreated'))
      store.setItem('ryfmaContentTitle', '')
      store.setItem('ryfmaContentState', '')
      store.setItem('ryfmaContentTags', '')
      store.setItem('ryfmaContentMetaContext', '')
      ReactGA.event({
        category: 'User',
        action: 'PostCreated'
      })
      this.props.history.push(`/p/${response.data.insertPost._id}?refresh`)
    } catch (error) {
      console.info(error)
      Notification.error(error)
    }
  }

  render () {
    return (
      <EditorWrapper
        insertPost={this.insert.bind(this)}
      />
    )
  }
}

const insertPost = gql`
  mutation insertPost(
    $title: String!,
    $slug: String!,
    $htmlBody:  String!,
    $excerpt: String!,
    $status: String!,
    $sticky: Boolean,
    $coverImg: String,
    $tags: [String]!,
  ) {
    insertPost(
      title: $title,
      slug: $slug,
      htmlBody: $htmlBody,
      excerpt: $excerpt,
      status: $status,
      sticky: $sticky,
      coverImg: $coverImg,
      tags: $tags,
    ){
      _id
    }
  }
`

const NewPostWithData = compose(
  graphql(insertPost, {
    props ({ mutate }) {
      return {
        insertPost (postVariables) {
          return mutate({ variables: postVariables })
        }
      }
    }
  })
)(NewPost)

export default translate()(withRouter(withCurrentUser(NewPostWithData)))
