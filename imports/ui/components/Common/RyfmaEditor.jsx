import React from 'react'
import { translate } from 'react-i18next'
import { convertToRaw, ContentState, EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import store from '/lib/store'

class RyfmaEditor extends React.Component {
  constructor (props) {
    super(props)

    let editorContents = []
    if (typeof window !== 'undefined') {
      const savedHtml = store.getItem('ryfmaContentState') ? store.getItem('ryfmaContentState').replace(/\\n/gi, '') : ''
      const defaultBody = this.props.defaultHtmlBody.indexOf('<p>') > 0 ? this.props.defaultHtmlBody : `<p>${this.props.defaultHtmlBody}</p>`
      const html = defaultBody || savedHtml
      const contentBlock = htmlToDraft(html)
      // const contentBlock = convertFromRaw(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorContent = EditorState.createWithContent(contentState)
        editorContents[0] = editorContent
        editorContents = [...editorContents]
      }

      // editorContents[0] = htmlToDraft(contentStateItem);
      // editorContents = [...editorContents];
    }
    this.state = {
      editorContents
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.activeChapter !== nextProps.activeChapter) {
      const nextDefaultHtmlBody = nextProps.defaultHtmlBody
        .replace('<p></p>\n\r', '')
        .replace('<p></p>\n', '')
        .replace('<p></p>↵', '')
      const defaultBody = nextDefaultHtmlBody.indexOf('<p>') > 0 ? nextDefaultHtmlBody : `<p>${nextDefaultHtmlBody}</p>`
      const contentBlock = htmlToDraft(defaultBody)
      let editorContents = []
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorContent = EditorState.createWithContent(contentState)
      editorContents[0] = editorContent
      editorContents = [...editorContents]

      this.setState({
        editorContents
      })
    }
  }

  onEditorStateChange: Function = (index, editorContent) => {
    let editorContents = this.state.editorContents
    editorContents[index] = editorContent
    editorContents = [...editorContents]

    const content = editorContents[0] && draftToHtml(convertToRaw(editorContents[0].getCurrentContent()))
    const htmlBody = content
    store.setItem('ryfmaContentState', htmlBody)

    this.setState({
      editorContents
    })
    this.props.setHtmlBody(htmlBody)
  }

  uploadImageCallBack (file) {
    return new Promise(
      (resolve, reject) => {
        resolve({ link: 'http://dummy_image_src.com' })
      }
    )
  }

  render () {
    const { t } = this.props
    const toolbar = {
      blockType: {
        inDropdown: true,
        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
        className: undefined,
        component: undefined,
        dropdownClassName: undefined
      },
      options: [
        'blockType', 'inline', 'textAlign', 'remove', 'history'
      ],
      inline: {
        options: ['bold', 'italic', 'underline', 'strikethrough']
      },
      image: { uploadCallback: this.uploadImageCallBack }
    }
    const { editorContents } = this.state

    // const forcedState = EditorState.forceSelection(editorContents, editorContents.getSelection());

    return (<div className='editor-wrapper'>
      <Editor
        toolbarClassName='ryfma-toolbar'
        wrapperClassName='ryfma-wrapper'
        editorClassName={this.props.editorClassName}
        placeholder={t('startGreatStory')}
        spellCheck
        stripPastedStyles
        editorState={editorContents[0]}
        onEditorStateChange={this.onEditorStateChange.bind(this, 0)}
        toolbar={toolbar}
      />
    </div>
    )
  }
}

export default translate()(RyfmaEditor)
