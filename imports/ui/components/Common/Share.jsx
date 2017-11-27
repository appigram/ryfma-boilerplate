import React from 'react'
import { List, Button, Popup } from 'semantic-ui-react'

import {
  ShareButtons,
  // ShareCounts,
  generateShareIcon
} from 'react-share'

const {
  FacebookShareButton,
  TwitterShareButton,
  VKShareButton
} = ShareButtons

/* const {
  FacebookShareCount,
} = ShareCounts; */

const FacebookIcon = generateShareIcon('facebook')
const TwitterIcon = generateShareIcon('twitter')
const VKIcon = generateShareIcon('vk')

class Share extends React.Component {
  render () {
    const shareUrl = this.props.shareUrl ? `http://sf1.welyx.com${this.props.shareUrl}` : 'http://sf1.welyx.com'
    const title = this.props.title ? this.props.title : 'MO.ST - Вкусные стихи и проза. Публикуйся и читай бесплатно.'
    const description = this.props.description ? this.props.description : 'Самое уютное сообщество писателей и читателей. Пиши стихи, читай и слушай книги бесплатно. Подбор рифмы к слову онлайн. Создание фото для Instagram, VK и других'
    const image = this.props.image ? this.props.image : 'https://cdnryfma.s3.amazonaws.com/defaults/icons/default_full_avatar.jpg'
    const via = 'ryfma'
    const hashtags = this.props.hashtags ? this.props.hashtags : []

    /* const fbLink = "https://www.facebook.com/dialog/feed?"
             + "app_id=" + encodeURIComponent('1127643753917982')
             + "&display=popup&caption=" + encodeURIComponent(title)
             + "&link=" + encodeURIComponent(shareUrl)
             + "&picture=" + encodeURIComponent(image)
             + "&redirect_uri=" + encodeURIComponent("https://www.facebook.com/");

      <List.Item>
        <a href={`https://www.facebook.com/dialog/feed?app_id=1127643753917982&display=popup&link=${encodeURIComponent(shareUrl)}&name=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&next=${encodeURIComponent(shareUrl)}&picture=${encodeURIComponent(image)}`} target='_blank' role="button" tabindex="0" className="SocialMediaShareButton SocialMediaShareButton--facebook share-button">
          <div style={{ width: 36, height: 36}}>
            <svg viewBox="0 0 64 64" fill="white" width="36" height="36" className="social-icon social-icon--facebook ">
              <g>
                <circle cx="32" cy="32" r="31" fill="#3b5998"></circle>
              </g>
              <g>
                <path d="M34.1,47V33.3h4.6l0.7-5.3h-5.3v-3.4c0-1.5,0.4-2.6,2.6-2.6l2.8,0v-4.8c-0.5-0.1-2.2-0.2-4.1-0.2 c-4.1,0-6.9,2.5-6.9,7V28H24v5.3h4.6V47H34.1z">
                </path>
              </g>
            </svg>
          </div>
        </a>
        </List.Item> */

    const shareList = <List link horizontal className={this.props.type === 'big' ? 'share-menu big' : 'share-menu'}>
      <List.Item>
        <FacebookShareButton
          url={shareUrl}
          quote={title}
          className='share-button'
        >
          <FacebookIcon
            size={this.props.type === 'big' ? 36 : 28}
            round />
        </FacebookShareButton>
      </List.Item>
      <List.Item>
        <TwitterShareButton
          url={shareUrl}
          title={title}
          via={via}
          hashtags={hashtags}
          className='share-button'>
          <TwitterIcon
            size={this.props.type === 'big' ? 36 : 28}
            round />
        </TwitterShareButton>
      </List.Item>
      <List.Item>
        <VKShareButton
          url={shareUrl}
          title={title}
          image={image}
          windowWidth={660}
          windowHeight={460}
          className='share-button'>
          <VKIcon
            size={this.props.type === 'big' ? 36 : 28}
            round />
        </VKShareButton>
      </List.Item>
    </List>

    if (this.props.type === 'small') {
      return <Popup
        trigger={<Button basic icon='share alternate' size='huge' className='share-small' />}
        content={shareList}
        on='click'
        position='bottom right'
        className='share-small-popup'
      />
    } else {
      return shareList
    }
  }
}

export default Share
