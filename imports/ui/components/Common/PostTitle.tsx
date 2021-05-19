import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Users from 'react-feather/dist/icons/users'
import DollarSign from 'react-feather/dist/icons/dollar-sign'
import Star from 'react-feather/dist/icons/star'
import Headphones from 'react-feather/dist/icons/headphones'
import Video from 'react-feather/dist/icons/video'
import Avatar from '/imports/ui/components/Common/Avatar'
import TimeAgoExt from '/imports/ui/components/Common/TimeAgoExt'
import { useSettings } from '/imports/hooks'

function PostTitle ({ id, username, name, userAvatar, coverImg, verified, title, slug, created, updated, roles, isAdultContent, isPromoted, showPromote, isEditorsPick, paymentType, videoLink, audioFiles, isAMP, postType }) {
  const [t] = useTranslation('form')
  const { isMobile } = useSettings()

  const editorBadge = isEditorsPick && <div className='ui badge editors-pick'>
    <img src='https://cdn.ryfma.com/defaults/icons/award.svg' alt='Ryfma award icon' className='award-icon' width='24' height='24'/>
    <span className='hide-mobile'>{t('common:editorsPick')}</span>
  </div>

  return (
    <header className='post-title'>
      <Avatar image={userAvatar} username={username} name={name} roles={roles} type='middle' isComment size={56} isAMP={isAMP} />
      <div className='post-title-info'>
        <div className='post-title-header'>
          <h3 className='ui header'>
            <Link to={`/p/${id}/${slug}`} title={title} itemProp='url'>{title}</Link>
          </h3>
        </div>
        <div className='post-title-bottom'>
          {t('common:by')}
          <div>
            <Link rel='author' to={`/u/${username}`} title={name}>
              <span className={verified ? 'verified' : ''}>{name}</span>
            </Link>
          </div>
          {!isPromoted && <span className='dot-divider'>·</span>}
          {!isPromoted && <span className='post-date'>
            <TimeAgoExt date={created} />
          </span>}
        </div>
        {isPromoted && <div className='promo-badge'>
          {t('common:promotion')}
        </div>}
        {isMobile && editorBadge}
      </div>
      {!isMobile && editorBadge}
      <div className='badges'>
        {isAdultContent && <a title={t('adultContent')}>
            18+
          </a>}
        {paymentType === 1 && <a title={t('common:postFollowersOnly')}>
            <Users size={20} />
          </a>}
        {paymentType === 2 && <a title={t('common:postPaid')}>
            <DollarSign size={20} />
          </a>}
        {isPromoted && <a title={t('common:postPromoted')}>
            <Star size={20} />
          </a>}
        {showPromote && <Link to={`/me/promote/${id}`} className='promote-badge' title={t('common:postPromoteMsg')}>
            <i aria-hidden='true' className='icon bolt' />{t('common:promote')}
          </Link>}
        {videoLink && <a title={t('common:postVideo')}>
            <Video size={20} />
          </a>}
        {audioFiles && <a title={t('common:postAudio')}>
            <Headphones size={20} />
          </a>}
      </div>
    </header>
  )
}

export default PostTitle
