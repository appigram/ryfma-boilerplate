import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Users from 'react-feather/dist/icons/users'
import DollarSign from 'react-feather/dist/icons/dollar-sign'
import Star from 'react-feather/dist/icons/star'
import Headphones from 'react-feather/dist/icons/headphones'
import Video from 'react-feather/dist/icons/video'
import Heart from 'react-feather/dist/icons/heart'
import MessageCircle from 'react-feather/dist/icons/message-circle'
import Eye from 'react-feather/dist/icons/eye'
// import Gift from 'react-feather/dist/icons/gift'
import LinkIcon from 'react-feather/dist/icons/link'
import Edit from 'react-feather/dist/icons/edit'
import MoreHorizontal from 'react-feather/dist/icons/more-horizontal'
import TimeAgoExt from '/imports/ui/components/Common/TimeAgoExt'
import nFormatter from '/lib/utils/helpers/nFormatter'
import RDropdown from '/imports/ui/components/Common/Dropdown'

let ShareModal = () => null

function PostsListItemShort ({ post, isPromo, isMobile, isOwner, position }) {
  const [t] = useTranslation('post')
  const [openShareModal, setOpenShareModal] = useState(false)

  const postTags = useMemo(() => post.tags.map((tag) => tag.name.toLowerCase()), [post.tags])

  const postLikes = nFormatter(post.likeCount || 0)
  const postComments = nFormatter(post.commentsCount || 0)
  const postViews = nFormatter(post.viewCount || 0)

  if (isPromo) {
    return (<Link to={`/me/promote/${post._id}`} className='item post-list-item short-item' >
      <div className='content'>
        <div className='post-title'>
          <div className='post-title-info'>
            <div className='post-title-header'>
              <h3>
                {post.title}
              </h3>
              <span className='post-date'>
                <TimeAgoExt date={post.createdAt} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>)
  }

  const handleShareNative = async () => {
    if (isMobile && navigator.share) {
     navigator.share({
        title: `📗${post.title} (${post.author.profile.name}) - ${t('seoTitle')} ${postTags.includes('сказка') ? t('seoTitleFairytail') : ''} ${postTags.includes('стихи') ? t('seoTitlePoem') : ''} ${t('seoTitleOnRyfma')}`,
        url: `https://ryfma.com/p/${post._id}/${post.slug}`,
        text: `${post.excerpt ? post.excerpt.replace(/<br\s\/>/gi, '\n') : ''}${t('postDefaultDesc')}`
      }).then(() => {
        console.log('Thanks for sharing!')
      })
      .catch(console.error)
    } else {
      const importedModule = await import('/imports/ui/components/Posts/lazy/shareModal')
      ShareModal = importedModule.default
      setOpenShareModal(true)
    }
  }

  const badges = []
  if (post.isEditorsPick) {
    badges.push(<span key='b_editor' className='ui badge editors-pick'>
      <img src='https://cdn.ryfma.com/defaults/icons/award.svg' className='award-icon' width='14' height='14'/>
    </span>)
  }

  if (post.isAdultContent) {
    badges.push(<span key='b_18'>18+</span>)
  }
  if (post.paymentType === 1) {
    badges.push(<span key='b_users'><Users size={14} /></span>)
  }
  if (post.paymentType === 2) {
    badges.push(<span key='b_dollar'><DollarSign size={14} /></span>)
  }
  if (post.isPromoted) {
    badges.push(<span key='b_promo'><Star size={14} /></span>)
  }
  if (post.videoLink) {
    badges.push(<span key='b_video'><Video size={14} /></span>)
  }
  if (post.audioFiles && post.audioFiles.length > 0) {
    badges.push(<span key='b_audio'><Headphones size={14} /></span>)
  }

  return (<div className='item post-list-item short-item' itemScope itemProp="itemListElement" itemType="https://schema.org/ListItem">
    <meta itemProp="position" content={position} />
    <div className='content'>
      <div className='post-info'>
        <Link to={`/p/${post._id}/${post.slug}`} title={post.title} itemProp='url'>
          <h3 className='ui header name'>
            {post.title}
          </h3>
          <span className='badges'>
            {badges}
          </span>
        </Link>
        <div className='meta'>
          <Link to={`/u/${post.author.username}`} className='user-link' title={post.author.profile.name}>u/{post.author.username}</Link>
          <span className='dot-divider'>·</span>
          <span className='post-date'>
            <TimeAgoExt date={post.createdAt} />
          </span>
          {post.album && (
            <span className='post-from-album'>
              <span className='dot-divider'>·</span>
              {t('fromAlbum')}
              <Link key={2} to={`/album/${post.album._id}/${post.album.slug}`} title={post.album.title}>
                {post.album.title}
              </Link>
            </span>
          )}
        </div>
      </div>
      <div className='post-stats'>
        {post.likeCount  > 0 && <span className='stat-item'><Heart size={14}/>{postLikes}</span>}
        {post.commentsCount  > 0 && <span className='stat-item'><MessageCircle size={14} />{postComments}</span>}
        {post.viewCount  > 0 && <span className='stat-item'><Eye size={14} />{postViews}</span>}
        {isOwner && <RDropdown 
          text={<MoreHorizontal size={14} />}
          className='extra-actions-dropdown stat-item'
        >
          <div 
            role='option'
            className={'item'}
          >
            <span className='text'>
              <Link to={`/p/${post._id}/${post.slug}/edit`}><Edit size={14} />{t('common:edit')}</Link>
            </span>
          </div>
          {/* <Dropdown.Item text={<span><Gift size={14} />{t('common:giveAward')}</span>} onClick={handleSendGift} /> */}
          <div 
            role='option'
            className={'item'}
            onClick={handleShareNative}
          >
            <span className='text'>
              <LinkIcon size={14} />{t('common:shareSocial')}
            </span>
          </div>
        </RDropdown>}
      </div>
    </div>
    {openShareModal && <ShareModal post={post} postTags={postTags} openShareModal={openShareModal} setOpenShareModal={setOpenShareModal} />}
  </div>
  )
}

export default PostsListItemShort
