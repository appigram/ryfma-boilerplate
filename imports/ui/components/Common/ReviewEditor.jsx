import React, { Component } from 'react'
import Editor from 'draft-js-plugins-editor'
import createEmojiPlugin from 'draft-js-emoji-plugin'

const emojiPlugin = createEmojiPlugin({
  useNativeArt: true
})
const { EmojiSuggestions, EmojiSelect } = emojiPlugin
const plugins = [emojiPlugin]

export default class ReviewEditor extends Component {
  focus = () => {
    this.editor.focus()
  }

  render () {
    return (<div>
      <div className='review-editor' onClick={this.focus}>
        <Editor
          editorState={this.props.editorState}
          onChange={this.props.onChange}
          plugins={plugins}
          ref={(element) => { this.editor = element }}
        />
        <EmojiSuggestions />
      </div>
      <div className='emoji-picker'>
        <EmojiSelect />
      </div>
    </div>)
  }
}
