import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'
import Heart from 'react-feather/dist/icons/heart'
import RCoin from '/imports/shared/svg/rcoin'
import PostTitle from '/imports/ui/components/Common/PostTitle'
import { Notification } from '/imports/ui/components/Notification/Notification'
import LazyLoadOrChildren from '/imports/ui/components/Common/LazyLoadOrChildren'
import { useMutation } from '@apollo/client/react'
import { useAuth, useSettings } from '/imports/hooks'
import FOLLOW_USER from '/imports/graphqls/mutations/User/followUser'
import INCREASE_POST_VIEW_COUNT from '/imports/graphqls/mutations/Post/increasePostViewCount'
import ALLOW_ADULT_CONTENT from '/imports/graphqls/mutations/Common/allowAdultContent'
import createPayment from '/imports/graphqls/mutations/Payment/createPayment'
import videoLinkParser from '/lib/utils/helpers/videoLinkParser'

let CheckoutForm = () => null
let PaymentForm = () => null
let NotEnoughForm = () => null
let LoginForm = () => null
let UserDonationBlock = () => null

function PostsListItem ({ post, currCoins, isPromoted, isOwner, sponsorOf = [], postType, isAMP, position }) {
  const [t] = useTranslation('post')
  const history = useHistory()
  const { currUser, currUserId } = useAuth()
  const { isMobile } = useSettings()

  const [isAdultContent, setIsAdultContent] = useState(post.isAdultContent)
  const [paymentSucceed, setPaymentSucceed] = useState(post.isBought || false)
  const [isFollowing, setIsFollowing] = useState(post.author.isFollowing || false)
  const [isFollowersOnly, setIsFollowersOnly] = useState(post.paymentType === 1)
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [openPaymentForm, setOpenPaymentForm] = useState(false)
  const [openCheckoutPaymentForm, setOpenCheckoutPaymentForm] = useState(false)
  const [openNotEnoughForm, setOpenNotEnoughForm] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('token')

  const isPaid = post.paymentType === 2
  const isSponsorsOnly = post.paymentType === 3

  const isAllowAdultContent = currUser ? currUser.isAllowAdultContent : false

  const [allowAdultContent] = useMutation(ALLOW_ADULT_CONTENT)
  const [increasePostViewCount] = useMutation(INCREASE_POST_VIEW_COUNT)
  const [followUser] = useMutation(FOLLOW_USER)
  const [createPaymentMutation] = useMutation(createPayment)

  useEffect(() => {
    try {
      if (post) {
        increasePostViewCount({ variables: { _id: post._id, userId: currUserId, status: post.status } })
      }
    } catch (err) {}
  }, [])

  const handleAdultContent = async () => {
    try {
      await allowAdultContent()
      setIsAdultContent(!isAdultContent)
    } catch (error) {
      Notification.error(error)
    }
  }

  const handleFollowersOnly = async () => {
    if (!currUserId) {
      Notification.error('Войдите в свой аккаунт, чтобы подписываться на других авторов')
      return
    }
    try {
      const followed = await followUser({ variables: { _id: post.author._id } })
      setIsFollowersOnly(followed)
      setIsFollowing(true)
      history.push(`/p/${post._id}/${post.slug}`)
    } catch (error) {
      Notification.error(error)
    }
  }

  const completePayment = async (payMethod) => {
    const paymentTotalMethod = payMethod || paymentMethod
    const price = post.coins
    const amount = 1

    if (currUser) {
      const payParams = {
        paymentMethod: paymentTotalMethod,
        amount: currUser.roles.includes('admin') ? 2 : parseInt(price, 10),
        currency: 'RUB',
        phone: phoneNumber,
        orderType: 'buyPost',
        objectId: post._id,
        objectType: 'post',
        objectAmount: parseInt(amount, 10),
        isRecurrent: false,
        returnUrl: 'https://ryfma.com/p/' + post._id + '/' + post.slug
      }

      try {
        const result = await createPaymentMutation({ variables: payParams })
        console.log('Result from server')
        setOpenCheckoutPaymentForm(false)
        const importedModule = await import('react-ga')
        const ReactGA = importedModule.default
        ReactGA.event({
          category: 'Post',
          action: 'BuyPost',
          label: 'BuyPost: userId: ' + currUser._id + ' , price: ' + price + ' , amount: ' + amount,
          value: price
        })

        if (result) {
          if (result.data.createPayment.confirmation) {
            if (result.data.createPayment.confirmation.type === 'redirect') {
              window.location.replace(result.data.createPayment.confirmation.confirmation_url)
            }
          }
        }
      } catch (error) {
        Notification.error(error)
      }
    }
  }

  const handlePaid = () => async () => {
    const importedLoginModule = await import('/imports/ui/components/Common/LoginForm')
    LoginForm = importedLoginModule.default

    const importedModule = await import('/imports/ui/components/Common/CheckoutForm')
    CheckoutForm = importedModule.default
    setOpenCheckoutPaymentForm(true)
  }

  const handleCoinsPaid = (coins, amount) => async () => {
    // setOpenCheckoutPaymentForm(false)
    if (coins > amount) {
      const importedModule = await import('/imports/ui/components/Common/PaymentForm')
      PaymentForm = importedModule.default
      setOpenPaymentForm(true)
    } else {
      const importedModule = await import('/imports/ui/components/Common/NotEnoughForm')
      NotEnoughForm = importedModule.default
      setOpenNotEnoughForm(true)
    }
  }

  const handleSponsorship = async () => {
    const importedModule = await import('/imports/ui/components/Users/UserDonationBlock')
    UserDonationBlock = importedModule.default
    setShowDonationModal(true)
  }

  const handlePaymentMethod = (paymentMethod) => setPaymentMethod(paymentMethod)

  const handlePhoneNumber = (phoneNumber) => setPhoneNumber(phoneNumber)

  const handleCloseCheckout = () => {
    setOpenCheckoutPaymentForm(false)
    setOpenPaymentForm(false)
    setOpenNotEnoughForm(false)
  }

  const handleCloseDonationForm = () => setShowDonationModal(false)

  const handlePaymentSuccess = () => {
    setPaymentSucceed(true)
    setOpenPaymentForm(false)
  }

  const handleClosePaymentForm = () => {
    setOpenPaymentForm(false)
    setOpenCheckoutPaymentForm(false)
  }

  const handleCloseNotEnoughForm = () => setOpenNotEnoughForm(false)

  let lockedBanner = null
  if (isFollowersOnly && !isFollowing && !isPromoted && !sponsorOf.includes(post.author._id)) {
    lockedBanner = (<div className='overlay'>
      <div className='v-align'>
        <i aria-hidden='true' className='icon unlock' />
        {post.coins > 0
          ? <div>{t('postFor')} <RCoin size={16} />{post.coins}</div>
          : <div>{t('followersOnlyPost')}</div>}
        {isAMP ?
          <a href={`/u/${post.author.username}`} className='ui button unlock-button follow-button' target='_blank' rel="noreferrer">{t('subscribe')}</a>
          :
          <a className='ui button unlock-button follow-button' onClick={handleFollowersOnly}>{t('subscribe')}</a>
        }
      </div>
    </div>)
  }
  if (isAdultContent && !isAllowAdultContent) {
    lockedBanner = (<div className='overlay'>
    <div className='v-align'>
      <i aria-hidden='true' className='icon unlock' />
      <div>{t('youMustBeOld')}</div>
      {isAMP ?
        <a href={`/u/${post.author.username}`} className='ui button unlock-button adult-button' target='_blank' rel="noreferrer">{t('imOld')}</a>
        :
        <a className='ui button unlock-button adult-button' onClick={handleAdultContent}>{t('imOld')}</a>
      }
      </div>
    </div>)
  }
  if (isPaid && !paymentSucceed && !isPromoted) {
    lockedBanner = (<div className='overlay'>
      <div className='v-align'>
        <i aria-hidden='true' className='icon unlock' />
        <div>{t('postFor')} {post.coins}₽</div>
        <span className='ui button unlock-button follow-button' onClick={handlePaid()}>{t('unlock')}</span>
      </div>
    </div>)
  }

  if (isSponsorsOnly && !sponsorOf.includes(post.author._id) && !isPromoted) {
    lockedBanner = (<div className='overlay'>
      <div className='v-align'>
        <i aria-hidden='true' className='icon unlock' />
        <div>{t('sponsorsOnlyPost')}</div>
        {post.author.sponsors && <div className='sponsors'>
          {post.author.stats.sponsorsCount > 3 && <span className='active-sponsors'>{t('sponsorsAlready')}</span>}
          {post.author.sponsors.map(item => {
            return (<a key={item.username}>
              <div className='ui image tiny'>
                <img src={item.profile.image} alt={item.profile.name} />
              </div>
            </a>)
            })
          }
          {post.author.stats.sponsorsCount > 3 && <span className='more-sponsors'>+{post.author.stats.sponsorsCount - 3} {t('sponsors')}</span>}
        </div>}
        {isAMP ?
          <a href={`/u/${post.author.username}`} className='ui button unlock-button adult-button' target='_blank' rel="noreferrer">{t('sponsor')}</a>
          :
          <div className='ui button unlock-button adult-button' onClick={handleSponsorship}>
            <div><Heart size={18} color='white' />{t('sponsor')}</div>
          </div>
        }
      </div>
    </div>)
  }
  const isLocked = !!lockedBanner && !isOwner

  // const postBodyArr = post.excerpt.split('<br />')
  const postBodyFull = null
  let coverImg = post.coverImg || ''
  if (post.videoLink) {
    const videoLink = videoLinkParser(post.videoLink)
    if (isMobile) {
      coverImg = videoLink.hqImg
    } else {
      coverImg = videoLink.img
    }
  }

  return (<section key={post._id} className={post.isPromoted || isPromoted ? 'post-list-item promoted item' : 'post-list-item item'} itemScope itemProp="itemListElement" itemType="https://schema.org/ListItem">
    <meta itemProp="position" content={position} />
    <div className='content'>
      <PostTitle
        id={post._id}
        status={post.status}
        username={post.author.username}
        name={post.author.profile.name}
        verified={post.author.emails && post.author.emails[0]? post.author.emails[0].verified : false}
        videoLink={post.videoLink}
        audioFiles={post.audioFiles ? post.audioFiles.length > 0 : false}
        title={post.title}
        slug={post.slug}
        created={post.createdAt}
        updated={post.postedAt}
        userAvatar={post.author.profile.image}
        coverImg={coverImg}
        roles={post.author.roles}
        isAdultContent={post.isAdultContent}
        paymentType={post.paymentType}
        coins={post.coins}
        isPromoted={post.isPromoted || isPromoted}
        isEditorsPick={post.isEditorsPick}
        showPromote={!post.isPromoted && isOwner && post.status !== 1}
        isOwner={isOwner}
        postType={postType}
        isAMP={isAMP}
      />

      <div className='description'>
        <div className={isLocked ? 'post-body lock' : 'post-body'}>
          {postBodyFull
            ? <div>
              {postBodyFull}
              </div>
            : <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />}
          {coverImg &&
            <Link to={`/p/${post._id}/${post.slug}`} aria-label={post.title} title={post.title}>
              <div className='ui small image' style={isAMP ? { position: 'relative', width: '350px', height: '120px'} : {}}>
                <LazyLoadOrChildren
                  height={150}
                  offset={200}
                  once
                  placeholder={null}
                >
                  <img src={isMobile ? coverImg : (post.videoLink ? coverImg : coverImg.replace('_full_', '_thumb_'))} alt={post.title} title={post.author.profile.name + ' - ' + post.title} decoding='async' loading='lazy' width={isMobile ? '397' : '112'} height={isMobile ? '146' : '112'} />
                </LazyLoadOrChildren>
              </div>
            </Link>
          }
        </div>
        {isLocked && lockedBanner}
        {!isLocked && <Link to={`/p/${post._id}/${post.slug}`} className='read-more' aria-label={post.title} title={post.title}>{t('readMore')}</Link>}
      </div>
      {(openPaymentForm || openNotEnoughForm) && !currUserId && <LoginForm referer={`/p/${post._id}/${post.slug}`} handleCloseLoginForm={handleCloseCheckout} />}
      {openCheckoutPaymentForm && currUserId && <>
        <CheckoutForm
          open={openCheckoutPaymentForm && !openPaymentForm}
          onClose={handleCloseCheckout}
          completePayment={completePayment}
          handlePaymentMethod={handlePaymentMethod}
          handlePhoneNumber={handlePhoneNumber}
          amount={post.coins}
          allowCoinsPayment={true}
          handleCoinsPayment={handleCoinsPaid(currCoins, post.coins)}
        />
        {openPaymentForm && <PaymentForm
          ownerId={post.author._id}
          objectId={post._id}
          objectType='post'
          currCoins={currCoins}
          amount={post.coins}
          openPaymentForm
          handleClosePaymentForm={handleClosePaymentForm}
          handlePaymentSuccess={handlePaymentSuccess}
        />}
      </>
      }
      {openNotEnoughForm && currUserId &&
        <NotEnoughForm
          currCoins={currCoins}
          amount={post.coins}
          openNotEnoughForm
          handleCloseNotEnoughForm={handleCloseNotEnoughForm}
        />}
      {isSponsorsOnly && !isOwner && post.author.tariffs && showDonationModal &&
        <UserDonationBlock
          user={post.author}
          isOwner={isOwner}
          showDonation={showDonationModal}
          hideButton
          handleCloseDonationForm={handleCloseDonationForm}
        />}
      {post.promo && isOwner && <div className='promo-stat'>
        {post.promo.status === 1 && <div className=''><i aria-hidden='true' className='icon clock' />&nbsp;Ожидает проверки модератором</div>}
        {post.promo.status === 2 && <div className=''><i aria-hidden='true' className='icon users' /> Просмотров от продвижения: {post.promo ? post.promo.currentViews : 0} • Пост продвигается</div>}
        {post.promo.status === 5 && <div className=''><i aria-hidden='true' className='icon users' /> Просмотров от продвижения: {post.promo ? post.promo.currentViews : 0} • Продвижение завершено •
          <Link to={`/me/promote/${post._id}`} className='promote-badge' title={post.title}>
            <i aria-hidden='true' className='icon bolt' />{t('common:promoteMore')}
          </Link>
        </div>}
        {post.promo.status === 6 && <div className=''><i aria-hidden='true' className='icon users' /> Просмотров от продвижения: {post.promo ? post.promo.currentViews : 0} • На сегодня лимит показов исчерпан (Пауза)</div>}
      </div>}
    </div>
  </section>)
}

export default PostsListItem
