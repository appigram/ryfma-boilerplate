import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'
import Feather from 'react-feather/dist/icons/feather'
import Book from 'react-feather/dist/icons/book'
import AlignJustify from 'react-feather/dist/icons/align-justify'
import Server from 'react-feather/dist/icons/server'
import Compass from 'react-feather/dist/icons/compass'
import Coffee from 'react-feather/dist/icons/coffee'
import Award from 'react-feather/dist/icons/award'
import Activity from 'react-feather/dist/icons/activity'
import Star from 'react-feather/dist/icons/star'
import MessageSquare from 'react-feather/dist/icons/message-square'
// import { Dropdown } from 'semantic-ui-react'
import { useAuth, useSettings } from '/imports/hooks'
import RDropdown from '/imports/ui/components/Common/Dropdown'

function PostsListMenu ({ isActive, activeView, activeFilter, handleChangeView, handleChangeFilter }) {
  const [t] = useTranslation('notif')
  const history = useHistory()
  const { currUser, currUserId } = useAuth()
  const { isMobile } = useSettings()

  const handleToNewPost = () => {
    history.push('/new-post')
  }

  const handleChangePage = (newPage) => () => {
    history.push(newPage)
  }

  const iconSize = 16

  let view = <Server size={iconSize} />
  if (activeView === 'compact') {
    view = <AlignJustify size={iconSize} />
  }

  const renderBestFilter = () => {
    let text = t('common:thisDay')
    switch (activeFilter) {
      case 'day':
        text = t('common:thisDay')
        break
      case 'week':
        text = t('common:thisWeek')
        break
      case 'month':
        text = t('common:thisMonth')
        break
      case 'year':
        text = t('common:thisYear')
        break
    }

    return(<div key={5} className={(isActive === 'latest' || !currUserId) && isActive !== 'best' ? 'item card-info small latest active' : 'item card-info small latest'}>
      <RDropdown
        text={text}
        className='sort-dropdown'
        divider
      >
        <div 
          role='option'
          className={activeFilter === 'day' ? 'item active' : 'item'}
          onClick={handleChangeFilter('day')}
        >
          <span className='text'>
            {t('common:thisDay')}
          </span>
        </div>
        <div 
          role='option'
          className={activeFilter === 'week' ? 'item active' : 'item'}
          onClick={handleChangeFilter('week')}
        >
          <span className='text'>
            {t('common:thisWeek')}
          </span>
        </div>
        <div 
          role='option'
          className={activeFilter === 'month' ? 'item active' : 'item'}
          onClick={handleChangeFilter('month')}
        >
          <span className='text'>
            {t('common:thisMonth')}
          </span>
        </div>
        <div 
          role='option'
          className={activeFilter === 'year' ? 'item active' : 'item'}
          onClick={handleChangeFilter('year')}
        >
          <span className='text'>
            {t('common:thisYear')}
          </span>
        </div>
      </RDropdown>
    </div>)
  }

  const renderMobilePostsMenu = () => {
    let text = t('common:forYouTab')
    let view = <Compass size={iconSize} />
    switch (isActive) {
      case 'hot':
        text = t('common:hotTab')
        view = <Coffee size={iconSize} />
        break
      case 'latest':
        text = t('common:latestTab')
        view = <Activity size={iconSize} />
        break
      case 'best':
        text = t('common:bestTab')
        view = <Star size={iconSize} />
        break
      case 'picks':
        text = t('common:editorsTab')
        view = <Award size={iconSize} />
        break
      case 'live':
        text = t('common:liveTab')
        view = <MessageSquare size={iconSize} />
        break
    }

    return(<RDropdown
      text={<span className='action'>{view}<span className='desc'>{text}</span></span>}
      className='posts-menu-dropdown'
    >
      {currUserId && <div 
          role='option'
          className={isActive === 'home' ? 'item active' : 'item'}
          onClick={handleChangePage('/')}
        >
          <span className='text'>
            <Compass size={iconSize} />{t('common:forYouTab')}
          </span>
      </div>}
      <div 
          role='option'
          className={isActive === 'hot' ? 'item active' : 'item'}
          onClick={handleChangePage('/hot')}
        >
          <span className='text'>
            <Coffee size={iconSize} />{t('common:hotTab')}
          </span>
      </div>
      <div 
          role='option'
          className={isActive === 'latest' ? 'item active' : 'item'}
          onClick={handleChangePage('/latest')}
        >
          <span className='text'>
            <Activity size={iconSize} />{t('common:latestTab')}
          </span>
      </div>
      <div 
          role='option'
          className={isActive === 'best' ? 'item active' : 'item'}
          onClick={handleChangePage('/best')}
        >
          <span className='text'>
            <Star size={iconSize} />{t('common:bestTab')}
          </span>
      </div>
      <div 
          role='option'
          className={isActive === 'picks' ? 'item active' : 'item'}
          onClick={handleChangePage('/picks')}
        >
          <span className='text'>
            <Award size={iconSize} />{t('common:editorsTab')}
          </span>
      </div>
      <div 
          role='option'
          className={isActive === 'live' ? 'item active' : 'item'}
          onClick={handleChangePage('/live')}
        >
          <span className='text'>
            <MessageSquare size={iconSize} />{t('common:liveTab')}<span className='live-dot' />
          </span>
      </div>
    </RDropdown>)
  }

  return (<div className='feed-menu'>
    {currUserId && <div className='new-post-block'>
      <Link to={`/u/${currUser.username}`} className='new-post-avatar'>
        <div className='user-avatar small'>
          <div className='user-avatar-inner'>
            <img className='ui tiny avatar image' src={currUser.profile.image} alt={currUser.profile.name} />
          </div>
        </div>
      </Link>
      <input className="new-post-input" placeholder={t('common:header.newPost')} type="text" onClick={handleToNewPost} />
      <Link to='/new-book' className='ui button new-post-button'><Book /></Link>
      <Link to='/new-post' className='ui button new-post-button'><Feather /></Link>
    </div>}
    <div className='posts-list-menu'>
      {isMobile ? <div className={currUserId ? 'ui horizontal list posts-list-menu-actions withUser' : 'ui horizontal list posts-list-menu-actions'}>
        {renderMobilePostsMenu()}
        {isActive === 'best' && renderBestFilter()}
      </div>
      :
      <div role='list' className={currUserId ? 'ui horizontal list posts-list-menu-actions withUser' : 'ui horizontal list posts-list-menu-actions'}>
        {!!currUserId && <div role='list' key={0} className={isActive === 'home' ? 'item card-info small for-you active' : 'item card-info small for-you'}>
          <Link to='/'>
            <Compass size={iconSize} />
            <span>{t('common:forYouTab')}</span>
          </Link>
        </div>}
        <div role='list' key={1} className={isActive === 'hot' ? 'item card-info small best active' : 'item card-info small best'}>
          <Link to='/hot'>
            <Coffee size={iconSize} />
            <span>{t('common:hotTab')}</span>
          </Link>
        </div>
        <div role='list' key={2} className={(isActive === 'latest' || !currUserId) && isActive !== 'best' ? 'item card-info small latest active' : 'item card-info small latest'}>
          <Link to='/latest'>
            <Activity size={iconSize} />
            <span>{t('common:latestTab')}</span>
          </Link>
        </div>
        <div role='list' key={3} className={isActive === 'picks' ? 'item card-info small picks active' : 'item card-info small best'}>
          <Link to='/picks'>
            <Award size={iconSize}/>
            <span>{t('common:editorsTab')}</span>
          </Link>
        </div>
        <div role='list' key={4} className={isActive === 'best' ? 'item card-info small best active' : 'item card-info small best'}>
          <Link to='/best'>
            <Star size={iconSize} />
            <span>{t('common:bestTab')}</span>
          </Link>
        </div>
        {isActive === 'best' && renderBestFilter()}
      </div>
      }
      <RDropdown
        text={<span className='text action'>{view}<span className='desc'>{t('common:viewMode')}</span></span>} className='view-dropdown'
      >
        <div 
          role='option'
          className={activeView === 'default' ? 'item active' : 'item'}
          onClick={handleChangeView('default')}
        >
          <span className='text'><Server />{t('common:defaultView')}</span>
        </div>
        <div
          role='option'
          className={activeView === 'compact' ? 'item active' : 'item'}
          onClick={handleChangeView('compact')}
        >
          <span className='text'><AlignJustify />{t('common:compactView')}</span>
        </div>
      </RDropdown>
  </div>
</div>)
}

export default PostsListMenu
