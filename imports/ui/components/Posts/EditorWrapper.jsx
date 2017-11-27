import React from 'react'
import { translate } from 'react-i18next'
import { Link, withRouter } from 'react-router-dom'
import getSlug from 'speakingurl'
import { Form, Button, Icon, Modal, Input, List, Checkbox } from 'semantic-ui-react'
import {Notification} from '../Notification/Notification'
import { Slingshot } from 'meteor/edgee:slingshot'
import { uploadBlobToS3 } from '/lib/uploadToCloud'
import ReactTags from 'react-tag-autocomplete'
import RyfmaEditor from '../Common/RyfmaEditor'
import ImageEditor from '../Common/ImageEditor'
import store from '/lib/store'
import { isMobile } from '/lib/utils/deviceDetect'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

class EditorWrapper extends React.Component {
  constructor (params) {
    super(params)

    const contentTagsItem = typeof window !== 'undefined' ? store.getItem('ryfmaContentTags') : ''
    let contentTags = []

    if (contentTagsItem) {
      if (/^[\],:{}\s]*$/.test(contentTagsItem.replace(/\\['\\\/bfnrtu]/g, '@')
        .replace(/'[^'\\\n\r]*'|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        // the json is ok
        contentTags = JSON.parse(contentTagsItem)
      }
    }

    // const metaContext = JSON.parse(store.getItem('ryfmaContentMetaContext'));
    const title = typeof window !== 'undefined' ? store.getItem('ryfmaContentTitle') : ''
    const htmlBody = typeof window !== 'undefined' ? store.getItem('ryfmaContentState') : ''

    this.state = {
      contentChanged: false,
      title: title || '',
      htmlBody: htmlBody || '',
      coverImg: '',
      tags: contentTags,
      tagsInserted: 0,
      tagEntering: false,
      metaContext: '',
      imageUploading: false,
      openDeletePost: false,
      errTitle: false,
      errBody: false,
      errTags: false
    }

    this.music = null
  }

  componentWillMount () {
    if (this.props.postData) {
      const post = this.props.postData
      this.setState({
        title: post.title,
        tags: post.tags,
        htmlBody: post.htmlBody,
        coverImg: post.coverImg
      })
    }
    const imageRestrictions = {
      allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
      maxSize: 2 * 1024 * 1024 // 2 MB (use null for unlimited)
    }
    Slingshot.fileRestrictions('postFullImage', imageRestrictions)
    Slingshot.fileRestrictions('postMiddleImage', imageRestrictions)
    Slingshot.fileRestrictions('postSmallImage', imageRestrictions)
  }

  submitPostForm = (coverImg) => {
    const htmlBody = this.state.htmlBody
      .replace(/&nbsp;/gi, '')
      .replace(/(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[\/\-\.]\d{4}/g, '')// remove dates
      .replace(/<(\w+)\b(?:\s+[\w\-.:]+(?:\s*=\s*(?:"[^"]*"|"[^"]*"|[\w\-.:]+))?)*\s*\/?>\s*<\/\1\s*>/g, '') // remove empty tags
      .trim()
    let excerpt = ''
    let index = 0
    const htmlBodyArray = htmlBody
      .replace(/<h1>|<h2>|<h3>|<h4>|<h5>|<em>|<strong>|<i>|<b>|<ins>|<del>|<blockquote>|<p style="(.*)">|<blockquote style="(.*)">|<pre>/gi, '<p>')
      .replace(/<\/h1>|<\/h2>|<\/h3>|<\/h4>|<\/h5>|<\/em>|<\/strong>|<\/i>|<\/b>|<\/ins>|<\/del>|<\/blockquote>|<\/pre>/gi, '</p>')
      .replace(/<\/p><p>/gi, '<br/>')
      .replace(/<p>/gi, '')
      .replace(/<\/p>/gi, '')
      .replace(/<br><br>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .trim()
      .split('\n')
    htmlBodyArray.map((node) => {
      if (index > 3) {
        return
      }
      if (node && node !== '') {
        excerpt = excerpt + node + '<br/>'
        index = index + 1
      }
    })

    if (excerpt === '') {
      Notification.error(this.props.t('common:writeSomething'))
      this.setState({
        errBody: true
      })
      return
    }

    const tags = this.state.tags.map((tag) => {
      return tag._id
    })

    const postVariables = {
      title: this.state.title,
      slug: getSlug(this.state.title, { lang: 'ru' }),
      htmlBody: htmlBody.replace(/^\s*[\r\n]/gm, '<br/>\n'),
      excerpt: excerpt,
      status: 2, // One of pending (`1`), approved (`2`), or deleted (`3`)
      sticky: false,
      coverImg: coverImg,
      tags: tags
    }

    if (this.props.insertPost) {
      this.props.insertPost(postVariables)
    }
    if (this.props.updatePost) {
      this.props.updatePost(postVariables)
    }
  }

  async removeImgFromS3 (imgUrl) {
    try {
      await this.props.removeImageFromS3({ imgUrl: imgUrl, silent: true })
    } catch (error) {
    }
  }

  deletePost = (event) => {
    event.preventDefault()

    this.removeImgFromS3(this.props.postData.coverImg)
    this.props.deletePost(this.props.postData._id)
  }

  async deleteTag (i) {
    const tags = this.state.tags
    const deleteTagId = tags[i]._id
    tags.splice(i, 1)
    if (typeof window !== 'undefined') store.setItem('ryfmaContentTags', JSON.stringify(tags))
    this.setState({ tags, tagsInserted: tags.length })

    try {
      await this.props.deleteTag({ _id: deleteTagId })
    } catch (err) {
      Notification.error(err)
    }
  }

  async addNewTag (tagInput) {
    // Process errors
    const tag = tagInput.name.toLowerCase().replace('#', '')

    if (tag.indexOf(' ') > 0) {
      const tagArr = tag.split(' ')
      tagArr.map((tagItem) => {
        if (tagItem.indexOf(',') > 0) {
          const tagItemArr = tagItem.split(',')
          tagItemArr.map((tagItemItem) => {
            this.insertNewTag(tagItemItem)
          })
        } else {
          this.insertNewTag(tagItem)
        }
      })
    } else if (tag.indexOf(',') > 0) {
      const tagArr = tag.split(',')
      tagArr.map((tagItem) => {
        if (tagItem.indexOf(' ') > 0) {
          const tagItemArr = tagItem.split(' ')
          tagItemArr.map((tagItemItem) => {
            this.insertNewTag(tagItemItem)
          })
        } else {
          this.insertNewTag(tagItem)
        }
      })
    } else {
      this.insertNewTag(tag)
    }
  }

  async insertNewTag (tagName) {
    if (!tagName || this.state.tagsInserted.length > 5) {
      return
    }
    // Cleanup chars
    tagName = tagName.replace(/[^a-z0-9\u0400-\u04FF]/gi, '')
    this.setState({ tagsInserted: this.state.tagsInserted + 1 })
    const currUser = JSON.parse(store.getItem('Meteor.currUser'))
    if (tagName !== currUser.profile.name || tagName !== currUser.username) {
      const tagVariables = {
        name: tagName,
        slug: getSlug(tagName)
      }
      try {
        const response = await this.props.insertTag(tagVariables)
        const tags = this.state.tags
        let tagExists = false
        tags.map((tag) => {
          if (tag.name === tagName) {
            tagExists = true
          }
        })
        if (!tagExists) {
          const newTag = { _id: response.data.insertTag._id, name: tagName }
          tags.push(newTag)
          if (typeof window !== 'undefined') {
            store.setItem('ryfmaContentTags', JSON.stringify(tags))
          }
          this.setState({ tags, errTags: false, tagEntering: false })
        }
      } catch (error) {
        console.info(error)
        Notification.error(error)
      }
    } else {
      Notification.error('Не используйте свое имя в тегах')
    }
  }

  tagEntering = () => {
    this.setState({
      tagEntering: true
    })
  }

  onChangeTitle = (event) => {
    store.setItem('ryfmaContentTitle', event.target.value)
    this.setState({
      title: event.target.value,
      errTitle: false
    })
  }

  onChangeHtmlBody = (htmlBody) => {
    store.setItem('ryfmaContentState', htmlBody)
    this.setState({
      htmlBody: htmlBody,
      errBody: false
    })
  }

  updateCanvasData = (metaContext) => {
    store.setItem('ryfmaContentMetaContext', JSON.stringify(metaContext))
    this.setState({
      metaContext,
      coverImg: ''
    })
  }

  uploadImagesToS3 = (event) => {
    event.preventDefault()
    const self = this

    if (!this.state.title) {
      Notification.error(this.props.t('common:notif.addPostTitle'))
      this.setState({
        errTitle: true
      })
      return
    }

    // htmlBody block
    if (!this.state.htmlBody) {
      Notification.error(this.props.t('common:writeSomething'))
      this.setState({
        errBody: true
      })
      return
    }

    // tags block
    if (this.state.tags.length === 0) {
      Notification.error(this.props.t('common:notif.addMoreTags'))
      this.setState({
        errTags: true
      })
      return
    }

    const metaContext = this.state.metaContext
    if (metaContext.fullCanvas) {
      this.setState({
        imageUploading: true
      })
      const timeNow = Date.now()
      const fullUploader = new Slingshot.Upload('postFullImage', { filename: metaContext.filename, filenamePrefix: 'post_full_', time: timeNow })
      const middleUploader = new Slingshot.Upload('postMiddleImage', { filename: metaContext.filename, filenamePrefix: 'post_thumb_', time: timeNow })
      const smallUploader = new Slingshot.Upload('postSmallImage', { filename: metaContext.filename, filenamePrefix: 'post_sidebar_', time: timeNow })
      console.log(metaContext)
      uploadBlobToS3(smallUploader, metaContext.smallCanvas) // async
      uploadBlobToS3(middleUploader, metaContext.middleCanvas) // async
      const fullImageUrl = uploadBlobToS3(fullUploader, metaContext.fullCanvas) // async, but waiting response
      fullImageUrl.then(function (src) {
        self.submitPostForm(src)
      }, function (err) {
      })
    } else {
      this.submitPostForm(this.state.coverImg || '')
    }
  }

  render () {
    const { t } = this.props
    const { tags, title, coverImg, htmlBody, openDeletePost, errTitle, errBody, errTags, contentChanged, imageUploading } = this.state
    // const contentSaved = store.getItem('ryfmaContentTitle')
    //  || store.getItem('ryfmaContentState')
    //  || store.getItem('ryfmaContentTags');

    return (<div className='editor-page'>
      {/* }<div className={contentSaved ? 'content-status success' : 'content-status'}>
        {contentSaved ? t('changesSaved') : t('changesNotSaved')}
      </div> */}
      {!isMobile && <div id='backto-left'>
        <Link to='/'>
          <div id='backto-bg'>
            <nobr id='backto-text'>
              <Icon name='angle left' size='big' />
              {t('common:back')}
            </nobr>
          </div>
        </Link>
      </div>
      }

      <Form onSubmit={this.uploadImagesToS3}>
        <Form.Field>
          <ImageEditor
            defaultImg={coverImg}
            updateCanvasData={this.updateCanvasData}
            objectType='post'
            objectId={this.props.match.params.postId}
          />
        </Form.Field>
        <Form.Field>
          <Input
            error={errTitle}
            placeholder={t('common:form.title')}
            value={title}
            type='text'
            id='post-title'
            onChange={this.onChangeTitle}
          />
        </Form.Field>
        <RyfmaEditor editorClassName={errBody ? 'ryfma-editor error' : 'ryfma-editor'} defaultHtmlBody={htmlBody} setHtmlBody={this.onChangeHtmlBody} />
        <ReactTags
          classNames={{ root: errTags ? 'react-tags error' : 'react-tags' }}
          tags={tags}
          placeholder={t('common:form.addTags')}
          handleDelete={this.deleteTag.bind(this)}
          handleAddition={this.addNewTag.bind(this)}
          handleInputChange={this.tagEntering}
          allowNew
        />
        {this.state.tagEntering && <span className='tag-enter'>{t('common:form.enterTag')}</span>}

        <div className='post-actions'>
          { this.props.postData
            ? <div>
              <Form.Field>
                <Button
                  className='delete-button'
                  floated='right'
                  onClick={(event) => {
                    event.preventDefault()
                    this.setState({ openDeletePost: true })
                  }}
                >
                  <Icon name='close' />
                  {t('deletePost')}
                </Button>
              </Form.Field>
              <Modal size='small' open={openDeletePost} onClose={() => this.setState({ openDeletePost: false })}>
                <Modal.Header>
                  {t('deletePost')}
                </Modal.Header>
                <Modal.Content>
                  <p>{t('deletePostText')}</p>
                </Modal.Content>
                <Modal.Actions>
                  <Button negative onClick={() => this.setState({ openDeletePost: false })}>
                    {t('common:no')}
                  </Button>
                  <Button positive icon='checkmark' labelPosition='right' content={t('common:yes')} onClick={this.deletePost} />
                </Modal.Actions>
              </Modal>
            </div>
            : null
          }
          <Button type='submit' primary disabled={imageUploading} className='publish-button'>
            {
              this.props.postData ? t('common:form.save') : t('common:form.publish')
            }
          </Button>
          {imageUploading && t('postSaving')}
        </div>
      </Form>
    </div>
    )
  }
}

const insertTag = gql`
  mutation insertTag(
    $name: String!,
    $slug: String!,
  ) {
    insertTag(
      name: $name,
      slug: $slug,
    ){
      _id
    }
  }
`

const deleteTag = gql`
  mutation deleteTag($_id: ID!) {
    deleteTag(
      _id: $_id
    ){
      _id
    }
  }
`

const removeImageFromS3 = gql`
  mutation removeImageFromS3($imgUrl: String!, $silent: Boolean) {
    removeImageFromS3(
      imgUrl: $imgUrl,
      silent: $silent,
    )
  }
`

EditorWrapper = compose(
  graphql(insertTag, {
    props ({ mutate }) {
      return {
        insertTag (tagVariables) {
          return mutate({ variables: tagVariables })
        }
      }
    }
  }),
  graphql(deleteTag, {
    props ({ mutate }) {
      return {
        deleteTag ({_id}) {
          return mutate({ variables: { _id } })
        }
      }
    }
  }),
  graphql(removeImageFromS3, {
    props ({ mutate }) {
      return {
        removeImageFromS3 (variables) {
          return mutate({ variables })
        }
      }
    }
  })
)(EditorWrapper)

export default translate('post')(withRouter(EditorWrapper))
