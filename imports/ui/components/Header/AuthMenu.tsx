import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Dropdown, Popup } from 'semantic-ui-react'
import User from 'react-feather/dist/icons/user'
import Inbox from 'react-feather/dist/icons/inbox'
import Bell from 'react-feather/dist/icons/bell'
import PlusCircle from 'react-feather/dist/icons/plus-circle'
import Book from 'react-feather/dist/icons/book'
// import Layers from 'react-feather/dist/icons/layers'
// import Activity from 'react-feather/dist/icons/activity'
import Settings from 'react-feather/dist/icons/settings'
// import FolderPlus from 'react-feather/dist/icons/folder-plus'
import ExternalLink from 'react-feather/dist/icons/external-link'
import Users from 'react-feather/dist/icons/users'
import Star from 'react-feather/dist/icons/star'
import Sliders from 'react-feather/dist/icons/sliders'
import Mail from 'react-feather/dist/icons/mail'
import HelpCircle from 'react-feather/dist/icons/help-circle'
import RCoin from '/imports/shared/svg/rcoin'
import AccountsLogout from '/imports/shared/meteor-react-apollo-accounts/logout'
import Avatar from '/imports/ui/components/Common/Avatar'
import UPDATE_AND_CHECK_NOTIFS from '/imports/graphqls/queries/Common/updateAndCheckNotifs'
import UPDATE_AND_CHECK_MESSAGES from '/imports/graphqls/queries/Common/updateAndCheckMessages'
import { useLazyQuery } from '@apollo/client/react'
import { Notification } from '/imports/ui/components/Notification/Notification'
import { useAuth, useSettings } from '/imports/hooks'
import store from '/lib/store'
import ReactGA from 'react-ga'

let WelcomeTour = () => null
let NotificationsList = () => null

function AuthMenu ({ currUser = null }) {
  const [t, i18n] = useTranslation(['form', 'notif_public'])
  const { signout, isPremium, setCurrUser } = useAuth()
  const { isMobile } = useSettings()
  const language = i18n.language

  const isUserLoggedIn = currUser && currUser !== 'undefined'

  const isNoAgeCity = isUserLoggedIn ? !currUser.profile.age || !currUser.profile.city : false

  const [openNotifs, setOpenNotifs] = useState(false)
  const [unreadNotifs, setUnreadNotifs] = useState(isUserLoggedIn ? currUser.profile.unreadNotifications : false)
  const [unreadMessages, setUnreadMessages] = useState(isUserLoggedIn ? currUser.profile.unreadMessages : false)
  const [skippedWelcomeTour, setSkippedWelcomeTour] = useState(isUserLoggedIn ? currUser.skippedWelcomeTour || 0 : 0)
  const [showWelcomeTour, setShowWelcomeTour] = useState((skippedWelcomeTour < 7 || isNoAgeCity) && !isPremium)
  const [showDropdown, setShowDropdown] = useState(false)
  const [steps, setSteps] = useState(!isNoAgeCity ? [1, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5, 6, 7])

  const [updateAndCheckNotifs] = useLazyQuery(UPDATE_AND_CHECK_NOTIFS, {
    // name: 'updateAndCheckNotifsQuery',
    fetchPolicy: 'no-cache'
  })
  const [updateAndCheckMessages] = useLazyQuery(UPDATE_AND_CHECK_MESSAGES, {
    // name: 'updateAndCheckMessagesQuery',
    fetchPolicy: 'no-cache'
  })

  const isAdmin = isUserLoggedIn ? currUser.roles.includes('admin') : false
  const money = isUserLoggedIn ? currUser.money || 0 : 0
  const coins = isUserLoggedIn  ? currUser.coins || 0 : 0

  useEffect(() => {
    if (currUser && showWelcomeTour && !skippedWelcomeTour) {
      const currDate = new Date()
      let nextDate = currDate
      if (store.getItem('Meteor.nextShowWelcomeTour')) {
        const nextTimeStored = parseInt(store.getItem('Meteor.nextShowWelcomeTour'), 10)
        nextDate = new Date(nextTimeStored)
      }
      const currTime = currDate.getTime() / 1000
      const nextTime = nextDate.getTime() / 1000
      const diff = Math.abs(currTime - nextTime)
      const diffDays = Math.ceil(diff / (60 * 60 * 24))
      if (diffDays < 1) {
        import('/imports/ui/components/Common/WelcomeTour').then(module => {
          WelcomeTour = module.default
          setShowWelcomeTour(true)
        })
      }
    }
  }, [])

  const logout = async (event) => {
    event.preventDefault()
    try {
      store.removeItem('ryfmaContentState')
      store.removeItem('ryfmaContentTitle')
      store.removeItem('ryfmaContentTags')
      store.removeItem('ryfmaContentMetaContext')
      store.removeItem('ryfmaPostAudio')
      store.removeItem('ryfmaInitOwnerId')
      ReactGA.event({
        category: 'User',
        action: 'LogOut',
        label: `LogOut: ${currUser._id}`,
        value: 1
      })
      signout()
      await AccountsLogout()
      Notification.success(t('notif_public:logOut'))
    } catch (error) {
      console.log(error)
      // Notification.error(error)
    }
    // history.push('/')
    setTimeout(() => {
      window.location.href = window.location.href + '?refresh=true'
    }, 1000)
    // window.location.reload()
    // client.resetStore()
  }

  const handleCloseWelcomeTour = () => setShowWelcomeTour(false)

  const startWritingNewPost = () => {
    if (isMobile) {
      ReactGA.event({
        category: 'User',
        action: 'PostStartWritingMobile',
        label: `PostStartWritingMobile: ${currUser._id}`,
        value: 1
      })
    } else {
      ReactGA.event({
        category: 'User',
        action: 'PostStartWriting',
        label: `PostStartWriting: ${currUser._id}`,
        value: 1
      })
    }
  }

  const handleUnreadMessages = () => {
    const newUser = currUser
    if (unreadMessages) {
      newUser.profile.unreadMessages = false
      setCurrUser(newUser)
      try {
        updateAndCheckMessages({ variables: { read: true } })
      } catch (err) {}
    }
    setUnreadMessages(false)
  }

  const handleCloseNotifs = () => setOpenNotifs(false)

  const handleOpenNotifs = async () => {
    const newUser = currUser
    if (unreadNotifs) {
      newUser.profile.unreadNotifications = false
      setCurrUser(newUser)
      try {
        updateAndCheckNotifs({ variables: { read: true } })
      } catch (err) {}
    }
    const module = await import('/imports/ui/components/Notifications/NotificationsList')
    NotificationsList = module.default
    setUnreadNotifs(false)
    setOpenNotifs(true)
  }

  const renderDesktopMenu = () => {
    const notifClass = unreadNotifs ? 'notif-wrapper active' : 'notif-wrapper'
    const msgClass = unreadMessages ? 'messages-menu active' : 'messages-menu'
    return (<>
      <Link to='/new-post' className='new-post-button button' onClick={startWritingNewPost}>
        <PlusCircle />
      </Link>
      <Link className={msgClass} to='/me/chats' onClick={handleUnreadMessages}>
        <Inbox />
      </Link>
      <Dropdown
        className='notif-topmenu'
        pointing='top right'
        onOpen={handleOpenNotifs}
        onClose={handleCloseNotifs}
        onBlur={handleCloseNotifs}
        icon={null}
        trigger={<span className={notifClass}>
          <Bell />
        </span>}
      >
        <Dropdown.Menu className='notif-menu'>
          {openNotifs && <NotificationsList />}
        </Dropdown.Menu>
      </Dropdown>
      {/* <Link to='/coins' className='ui button get-coins'>
        <RCoin size={14} />{t('common:getCoins')}
      </Link> */}
    </>)
  }

  const moneyPremiumBlock = (<><Dropdown.Item className='current-balance'>
    <div className='money'>
      <Link to='/me/payouts'>
        <b>{t('common:header.currentBalance')}</b>
        {isUserLoggedIn && <Popup
          trigger={<div>
            {currUser.currency === 'USD' && <span className='currency'>$</span>}
            <span className='money-value'>{money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
            {(!currUser.currency && !currUser.language && !language) && <span className='currency'>₽</span>}
            {currUser.currency === 'RUB' && <span className='currency'>₽</span>}
            {currUser.currency === 'EUR' && <span className='currency'>€</span>}
          </div>}
          content={t('common:header.currentBalanceDesc')}
          position='bottom center'
          size='mini'
          inverted
        />}
        <span className='action'>{t('common:header.redeem')}</span>
      </Link>
    </div>
    <div className='coins'>
      <Link to='/coins'>
        <b>{t('common:header.coins')}</b>
        <Popup
          trigger={<div>
            <RCoin size={17} />
            <span className='money-value'>{coins.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
          </div>}
          content={t('common:header.coinsDesc')}
          position='bottom center'
          size='mini'
          inverted
        />
        <span className='action'>{t('common:header.addMoreCoins')}</span>
      </Link>
    </div>
  </Dropdown.Item>{!isPremium && <Dropdown.Item>
    <Link className='upgrade' to='/upgrade' title={t('common:header.upgrade')} aria-label={t('common:header.upgrade')}>
      <Star />
      <div>
        {t('common:header.upgrade')}
        <div className='hint'>+500<RCoin size={14} /> {t('common:header.everyMonth')}</div>
      </div>
    </Link>
  </Dropdown.Item>}
  </>)

  return (<>{!isMobile && renderDesktopMenu()}<Dropdown
    upward={isMobile}
    pointing='top right'
    icon={null}
    onClick={(e) => setShowDropdown(true)}
    onClose={(e) => setShowDropdown(false)}
    trigger={
      <span className='user-topmenu'>
        {isUserLoggedIn && <div className='user-topmenu-wrapper'>
          <Avatar
            image={currUser.profile.image}
            username={currUser.username}
            name={currUser.profile.name}
            roles={currUser.roles}
            type='middle'
            noLink
          />
          {!isMobile && <div className='user-menu-content'>
            <span className='username'>{currUser.username}</span>
            {currUser.profile.karma && <span className='karma'><i aria-hidden='true' className='icon star red' />{currUser.profile.karma.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}&nbsp;{t('common:karma')}</span>}
          </div>}
          <i aria-hidden='true' className='icon dropdown' />
        </div>}
      </span>
    }
    >
    <Dropdown.Menu className='user-menu'>
      {showDropdown && <>
        {moneyPremiumBlock}
        <Dropdown.Divider />
        {isUserLoggedIn && <Dropdown.Item>
          <Link to={`/u/${currUser.username}`} title={t('common:header.myProfile')} aria-label={t('common:header.myProfile')}>
            <User />
            {t('common:header.myProfile')}
          </Link>
        </Dropdown.Item>}
        <Dropdown.Item>
          <Link className='chats' to='/me/chats'>
            <Inbox />
            {t('common:header.messages')}
          </Link>
        </Dropdown.Item>
        {isUserLoggedIn && <Dropdown.Item>
          <Link className='bookshelves' to={`/u/${currUser.username}/bookshelves`}>
            <Book />
            {t('common:header.myBookshelve')}
          </Link>
        </Dropdown.Item>}
        {/* <Dropdown.Item>
          <Link className='books' to={`/u/${currUser.username}/books`}>
            <Book />
            {t('common:header.myBooks')}
          </Link>
        </Dropdown.Item>
        <Dropdown.Item>
          <Link className='albums' to={`/u/${currUser.username}/albums`}>
            <FolderPlus />
            {t('common:header.myAlbums')}
          </Link>
        </Dropdown.Item> */}
        <Dropdown.Item>
          <Link className='memberships' to='/me/memberships'>
            <Users />
            {t('common:header.myMemberships')}
          </Link>
        </Dropdown.Item>
        <Dropdown.Item>
          <Link className='invites' to='/me/invites'>
            <Mail />
            {t('common:header.myInvites')}(+100<RCoin size={14} />)
          </Link>
        </Dropdown.Item>
        <Dropdown.Divider />
        {/* <Dropdown.Item>
          <Link className='stats disabled-link' to='#'>
            <Activity />
            {t('common:header.stats')}
          </Link>
        </Dropdown.Item> */}
        <Dropdown.Item>
          <Link to='/me' title={t('common:header.settings')} aria-label={t('common:header.settings')}>
            <Settings />
            {t('common:header.settings')}
          </Link>
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className='help-center'>
          <a href='mailto:info@ryfma.com' title={t('common:header.contactUs')} aria-label={t('common:header.contactUs')}>
            <HelpCircle />
            {t('common:header.contactUs')}
          </a>
        </Dropdown.Item>
        <Dropdown.Divider />
        {isAdmin &&
          <Dropdown.Item>
            <Link to='/radm'>
              <Sliders />
                Dashboard
            </Link>
        </Dropdown.Item>}
        <Dropdown.Item
          className='sign-out'
          icon={<ExternalLink />}
          text={t('signOut')}
          onClick={logout}
        />
        </>}
    </Dropdown.Menu>
  </Dropdown>
  {showWelcomeTour && WelcomeTour && <WelcomeTour showWelcomeTour={showWelcomeTour} steps={steps} skippedWelcomeTour ={skippedWelcomeTour} handleCloseWelcomeTour={handleCloseWelcomeTour}/>}
</>)
}

export default AuthMenu
