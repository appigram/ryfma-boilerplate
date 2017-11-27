import React from 'react'
import { translate } from 'react-i18next'
import { Link, withRouter } from 'react-router-dom'
import LazyLoad from 'react-lazyload'
import TimeAgoExt from '../Common/TimeAgoExt'
import {Notification} from '../Notification/Notification'
import CommentNew from './CommentNew'
import store from '/lib/store'
import { Comment, Form, Button, Modal, Icon, Image } from 'semantic-ui-react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import ReviewEditor from '../Common/ReviewEditor'
import { convertToRaw, convertFromHTML, ContentState, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'

class CommentItem extends React.Component {
  constructor (params) {
    super(params)

    const blocksFromHTML = convertFromHTML(this.props.comment.content)
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    )

    this.state = {
      isEdit: false,
      isReply: false,
      commentState: EditorState.createWithContent(state),
      commentText: this.props.comment.content,
      replyTo: '',
      openDeleteComment: false
    }
  }

  async updateComment (event) {
    event.preventDefault()

    const commentVariables = {
      _id: this.props.comment._id,
      content: this.state.commentText.trim(),
      objectType: this.props.objectType,
      objectId: this.props.objectId
    }

    try {
      await this.props.updateComment(commentVariables)
      Notification.success(this.props.t('common:notif.commentUpdated'))
      this.setState({
        isEdit: false,
        replyTo: ''
      })
    } catch (error) {
      console.info(error)
      Notification.error(error)
    }
  }

  editComment = () => {
    this.setState({
      isEdit: true
    })
  }

  cancelEdit = () => {
    this.setState({
      isEdit: false
    })
  }

  onChange = (commentState) => {
    const rawContentState = convertToRaw(this.state.commentState.getCurrentContent())
    const markup = draftToHtml(rawContentState)

    this.setState({
      commentState,
      commentText: markup
    })
  }

  addReply = (replyTo) => {
    this.setState({
      isReply: true,
      replyTo: `${this.state.replyTo} @${replyTo} `
    })
  }

  cancelReply = (commentId) => {
    this.setState({
      isReply: false,
      replyTo: ''
    })
  }

  render () {
    const { comment, index, author, objectType, objectId, reviewed, title, t } = this.props
    const { isEdit, isReply } = this.state
    const { hash } = window.location
    const isActive = hash.replace('#', '') === comment._id
    const currUserId = store.getItem('Meteor.userId')
    const isOwner = currUserId === comment.author._id

    let avatar = comment.author.profile.image || null
    if (comment.author.profile.image.indexOf('_full_') > 0) {
      avatar = comment.author.profile.image.replace('_full_', '_middle_')
    } else if (comment.author.profile.image.indexOf('graph.facebook.com') > 0) {
      avatar = comment.author.profile.image.replace('=large', '=square')
    }

    let commText = this.state.commentText
    const pattern = /\B[@＠][a-z0-9_-]+/gi
    const mentions = commText.match(pattern)
    if (mentions) {
      commText = mentions.map(mention => commText.replace(mention, `<a href='/u/${mention.replace('@', '').replace('＠', '')}' class='mention-link' target='_blank'>${mention}</a>`))
    }

    let commTextStyle = ''
    if (/\ud83d[\ude00-\ude4f]/g.test(commText)) {
      commTextStyle = 'emoji-only'
    }

    let replyClassName = 'no-reply'

    if (!isEdit && !!currUserId && !isOwner) {
      replyClassName = ''
    }

    return (<Comment key={index} id={comment._id} className={isActive ? 'active' : ''} style={{ opacity: 1 - comment.spamScore * 0.1 }}>
      <Link className='avatar' to={`/u/${comment.author.username}`}>
        <LazyLoad height={48} offset={200} once placeholder={<div className='ui tiny avatar image img-placeholder' />}>
          <Image src={avatar} alt={comment.author.profile.name} />
        </LazyLoad>
      </Link>
      <Comment.Content>
        <Link className='author' itemProp='name' to={`/u/${comment.author.username}`}>
          {comment.author.profile.name}
        </Link>
        <Comment.Metadata>
          <TimeAgoExt date={comment.postedAt} isComment />
        </Comment.Metadata>
        <span className='spam-block'>{comment.spamScore > 5 ? t('markedAsSpam') : null}</span>
        {!isEdit ? <Comment.Actions className='owner-actions'>
          {isOwner &&
            <Comment.Action onClick={this.editComment}>
              {t('common:edit')}
            </Comment.Action>}
          {isOwner && !reviewed &&
            <Comment.Action onClick={(event) => {
              event.preventDefault()
              this.setState({ openDeleteComment: true })
            }}>
              {t('common:remove')}
            </Comment.Action>}
          {!isOwner && !!currUserId &&
            <Comment.Action onClick={() => this.props.markCommentAsSpam(comment._id, comment.author._id, comment.spamScore)}
            >
              <Icon name='flag outline' />
              {t('common:spam')}
            </Comment.Action>
          }
          {isOwner && <Modal size='small' open={this.state.openDeleteComment} onClose={() => this.setState({ openDeleteComment: false })}>
            <Modal.Header>
              {t('deleteCommentHeader')}
            </Modal.Header>
            <Modal.Content>
              <p>{t('deleteCommentText')}</p>
            </Modal.Content>
            <Modal.Actions>
              <Button negative onClick={() => this.setState({ openDeleteComment: false })}>
                {t('common:no')}
              </Button>
              <Button
                positive
                icon='checkmark'
                labelPosition='right'
                content={t('common:yes')}
                onClick={() => {
                  this.props.deleteComment(comment._id, objectType, objectId, index)
                  this.setState({ openDeleteComment: false })
                }}
              />
            </Modal.Actions>
          </Modal>
          }
        </Comment.Actions>
          : null
        }

        {isEdit
          ? <Form className='submitEditForm' onSubmit={this.updateComment.bind(this)}>
            <ReviewEditor
              id='comment-textarea'
              placeholder={isReply ? t('writeReply') : t('writeOpinion')}
              className={this.state.errorReview ? 'editable-textarea error' : 'editable-textarea'}
              onChange={this.onChange}
              editorState={this.state.commentState}
            />
            <Button content={t('common:form.save')} labelPosition='left' icon='checkmark' primary />
            <Button className='cancelButton' content={t('common:form.cancel')} onClick={this.cancelEdit} as='a' basic />
          </Form>
          : <Comment.Text className={commTextStyle} itemProp='commentText' dangerouslySetInnerHTML={{ __html: commText }} />
        }
        <Comment.Actions className={replyClassName}>
          {replyClassName === '' ? <Comment.Action onClick={this.addReply.bind(this, comment.author.username)}>{t('common:reply')}</Comment.Action>
          : <span>&nbsp;</span>
          }
        </Comment.Actions>
        {isReply && !!currUserId
          ? <CommentNew
            isReply={isReply}
            author={author}
            replyTo={this.state.replyTo}
            objectType={objectType}
            objectId={objectId}
            title={title}
            cancelReply={this.cancelReply}
            insertNewComment={this.props.insertNewComment}
          />
          : null
        }

      </Comment.Content>
    </Comment>
    )
  }
}

const updateComment = gql`
  mutation updateComment(
    $_id: ID!,
    $content: String!,
    $objectType: String!,
    $objectId: String!,
  ) {
    updateComment(
      _id: $_id,
      content: $content,
      objectType: $objectType,
      objectId: $objectId,
    )
  }
`

const CommentItemWithData = compose(
  graphql(updateComment, {
    props ({ mutate }) {
      return {
        updateComment (commentVariables) {
          return mutate({ variables: commentVariables })
        }
      }
    }
  })
)(CommentItem)

export default translate('comment')(withRouter(CommentItemWithData))
