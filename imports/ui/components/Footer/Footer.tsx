import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth, useSettings } from '/imports/hooks'
import { Link } from 'react-router-dom'
import LazyLoadOrChildren from '/imports/ui/components/Common/LazyLoadOrChildren'
import Instagram from 'react-feather/dist/icons/instagram'
import Twitter from 'react-feather/dist/icons/twitter'
import Facebook from 'react-feather/dist/icons/facebook'
import YouTube from 'react-feather/dist/icons/youtube'
import VK from '/imports/shared/svg/vk'
import OK from '/imports/shared/svg/ok'

function Footer () {
  const [t] = useTranslation(['form', 'footer'])
  const { currUser } = useAuth()
  const { isMobile } = useSettings()

  return (<div className={isMobile ? 'ui segment inverted footer mobile-footer' : 'ui segment inverted footer'}>
    <div className='ui center aligned grid page'>
      <div className='row pages-links'>
        <div className='four wide column'>
          <div role='list' className='ui inverted link list'>
            <div role='listitem' className='item header'>
              <Link to='/' className='logo' title='На главную' aria-label='На главную'>
                <svg
                  xmlns='http://www.w3.org/2000/svg' width='36' height='36'
                  viewBox='0 0 200 200'
                >
                  <path fill='#FFFFFF' d='M100.1,135.3c-8.7,5.5-28.8,9.7-40.4,12.2c-4.5,0.9-9.1,7.6-11.4,11c-6.8,10-13.7,22.9-24,41.4C55.8,93,102.5,31.1,185.5,0.3c-1.2,9.8-7.4,33.4-17.6,36.3c-8.6,2.4-34.3,5.6-43,8.3c11.6,0.7,27.3,2.1,41.5,2.6c-8.6,18.4-27.1,52.6-60,79.2c-7,1.6-21.9,3-31,3.3C75.3,130.2,80.9,131.2,100.1,135.3z' />
                </svg>
                <span>Ryfma</span>
              </Link>
            </div>
            <div role='listitem' className='item ryfma-desc'>
              {t('footer:ryfmaDesc')}
            </div>
          </div>
          <div className='ui horizontal inverted link list social-menu'>
            <Link
              to='https://www.instagram.com/_ryfma_/'
              target='_blank'
              rel='nofollow noreferrer noopener'
              className='in item'
            >
              <Instagram /><b>90k</b>
            </Link>
            <Link
              to='https://vk.com/ryfma_poet'
              target='_blank'
              rel='nofollow noreferrer noopener'
              className='vk item'
            >
              <VK /><b>17k</b>
            </Link>
            <Link
              to='https://www.youtube.com/c/RyfmaRuOfficial?sub_confirmation=1'
              target='_blank'
              rel='nofollow noreferrer noopener'
              className='ok item'
            >
              <YouTube /><b>1000</b>
            </Link>
            <Link
              to='https://twitter.com/intent/follow?source=followbutton&variant=1.0&screen_name=ryfma'
              target='_blank'
              rel='nofollow noreferrer noopener'
              className='tw item'
            >
              <Twitter /><b>2k</b>
            </Link>
            <Link
              to='https://www.facebook.com/ryfma'
              target='_blank'
              rel='nofollow noreferrer noopener'
              className='fb item'
            >
              <Facebook /><b>1000</b>
            </Link>
            <Link
              to='https://www.ok.ru/ryfma'
              target='_blank'
              rel='nofollow noreferrer noopener'
              className='ok item'
            >
              <OK /><b>1000</b>
            </Link>
          </div>
        </div>
        <div className='three wide column'>
          <div role='list' className='ui inverted link list'>
            <div role='listitem' className='item header'>{t('footer:header1')}</div>
            <div role='listitem' className='item'><Link to='/blog'>{t('footer:blog')}</Link></div>
            <div role='listitem' className='item'><Link to='/aboutus'>{t('footer:aboutUs')}</Link></div>
            <div role='listitem' className='item'><Link to='/press'>{t('footer:pressKit')}</Link></div>
            {/* <div role='listitem' className='item'><Link to='/adv'>Advertise</Link></div> */}
            <div role='listitem' className='item'><a href='mailto:info@ryfma.com'>{t('footer:contact')}</a></div>
          </div>
        </div>
        <div className='three wide column'>
          <div role='list' className='ui inverted link list'>
            <div role='listitem' className='item header'>{t('footer:header2')}</div>
            <div role='listitem' className='item'><Link to='/books/all'>{t('common:header.books')}</Link></div>
            <div role='listitem' className='item'><Link to='/sponsors'>{t('footer:sponsors')}</Link></div>
            <div role='listitem' className='item'><Link to='/upgrade'>{t('footer:premium')}</Link></div>
            {/* <div role='listitem' className='item'><Link to='/cover-design'>{t('footer:bookCoverDesign')}</Link></div>*/}
            <div role='listitem' className='item'><Link to='/rhyme'>{t('common:header.rhymes')}</Link></div>
            {/* <div role='listitem' className='item'><Link to='/levitan'>{t('common:header.levitan')}</Link></div> */}
          </div>
        </div>
        <div className='three wide column'>
          <div role='list' className='ui inverted link list'>
            <div role='listitem' className='item header'>{t('footer:header3')}</div>
            {currUser && <div role='listitem' className='item'><Link to={`/u/${currUser.username}`}>{t('common:header.myProfile')}</Link></div>}
            <div role='listitem' className='item'><Link to='/authors'>{t('common:header.authors')}</Link></div>
            <div role='listitem' className='item'><Link to='/classic'>{t('common:header.classic')}</Link></div>
            <div role='listitem' className='item'><Link to='/fairytails'>{t('common:header.fairytails')}</Link></div>
            <div role='listitem' className='item'><Link to='/tagsmap'>{t('common:header.tags')}</Link></div>
            {!currUser && <div role='listitem' className='item'><Link to='/login'>{t('login')}</Link></div>}
            {!currUser && <div role='listitem' className='item'><Link to='/register'>{t('signUp')}</Link></div>}
          </div>
        </div>
        {/* <Grid.Column width={2}>
          <List link inverted>
            <div role='listitem' className='item'><Link to='/adv'>Advertise</Link></div>
            <div role='listitem' className='item'><Link to='/careers'>Careers</Link></div>
          </div>
        </Grid.Column> */}
        <div className='three wide column mobile-links'>
          <div role='list' className='ui inverted link list'>
            <div role='listitem' className='item header'>{t('footer:header4')}</div>
            <div role='listitem' className='item'>
              <div>
                {/* <div itemScope itemType='https://schema.org/MobileApplication'>
                <LazyLoadOrChildren height={44} offset={200} once placeholder={<div className='ui tiny image img-placeholder' />}>
                  <img className='hidden' itemProp='image' src='https://cdn.ryfma.com/defaults/icons/favicon-128.png' alt='Ryfma logo' width='128' height='128' />
                </LazyLoadOrChildren>
                <span className='hidden' itemProp='name'>Ryfma</span>
                <div className='hidden' itemProp='author' itemScope itemType='https://schema.org/Organization'>
                  <a itemProp='url' href='https://ryfma.com'><span itemProp='name'>Ryfma</span></a>
                </div>
                <div itemProp="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
                  <span itemProp="ratingValue">[rating given]</span>/
                  <span itemProp="bestRating">[highest possible rating]</span> stars from
                  <span itemProp="ratingCount">[total number of ratings]</span> users.
                </div>
                <time itemProp="datePublished" datetime="[date in ISO format e.g. 2012-04-15]">[publication date]</time>
                <meta itemProp='applicationCategory' content='Books' />
                <span className='hidden' itemProp='operatingSystem'>iOS</span>
                <div itemProp='offers' itemScope itemType='https://schema.org/Offer'>
                  <meta content='0' itemProp='price' />
                  <meta itemProp='priceCurrency' content='RUB' />
                </div>
                <meta itemProp="fileSize" content="[file size e.g. 14MB]"/>
                <meta itemProp="interactionCount" content="[number of user downloads] UserDownloads">
                <span itemProp="contentRating">[content rating e.g. Low Maturity]</span>
                <span itemProp="description">[description of the mobile application]</span> */}
                <div className='ui fade animated button'>
                  <div className='content visible'>
                    <LazyLoadOrChildren height={44} offset={200} once placeholder={<div className='ui tiny image img-placeholder' />}>
                      <img src='https://cdn.ryfma.com/defaults/icons/app-store-badge.svg' alt='Ryfma App Store' />
                    </LazyLoadOrChildren>
                  </div>
                </div>
              </div>
            </div>
            <div role='listitem' className='item'>
              <div>
                {/* <div itemScope itemType='https://schema.org/MobileApplication'>
                <img className='hidden' itemProp='image' src='https://cdn.ryfma.com/defaults/icons/favicon-128.png' alt='Ryfma logo' width='128' height='128' />
                <span className='hidden' itemProp='name'>Ryfma</span>
                <div className='hidden' itemProp='author' itemScope itemType='https://schema.org/Organization'>
                  <a itemProp='url' href='https://ryfma.com'><span itemProp='name'>Ryfma</span></a>
                </div>
                <div itemProp="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
                  <span itemProp="ratingValue">[rating given]</span>/
                  <span itemProp="bestRating">[highest possible rating]</span> stars from
                  <span itemProp="ratingCount">[total number of ratings]</span> users.
                </div>
                <time itemProp="datePublished" datetime="[date in ISO format e.g. 2012-04-15]">[publication date]</time>
                <meta itemProp='applicationCategory' content='Books' />
                <span className='hidden' itemProp='operatingSystem'>Android</span>
                <div itemProp='offers' itemScope itemType='https://schema.org/Offer'>
                  <meta content='0' itemProp='price' />
                  <meta itemProp='priceCurrency' content='RUB' />
                </div>
                <meta itemProp="fileSize" content="[file size e.g. 14MB]"/>
                <meta itemProp="interactionCount" content="[number of user downloads] UserDownloads">
                <span itemProp="contentRating">[content rating e.g. Low Maturity]</span>
                <span itemProp="description">[description of the mobile application]</span> */}
                <div className='ui fade animated button'>
                  <div className='content visible'>
                    <LazyLoadOrChildren height={44} offset={200} once placeholder={<div className='ui tiny image img-placeholder' />}>
                      <img src='https://cdn.ryfma.com/defaults/icons/google-play-badge.svg' alt='Ryfma Google Play' />
                    </LazyLoadOrChildren>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row footer-bottom'>
        <div role='list' className='ui horizontal inverted link list reserved-menu'>
          <div role='listitem' className='item'>
            © 2020 Ryfma. {t('footer:allRightsReserved')} <span className='age-law'>12+</span>
          </div>
        </div>
        <div role='list' className='ui horizontal inverted link list legal-menu'>
          <div role='listitem' className='item'><Link to='/faq'>{t('footer:helpAndFaq')}</Link></div>
          <div role='listitem' className='item'><Link to='/terms'>{t('footer:termsOfUse')}</Link></div>
          <div role='listitem' className='item'><Link to='/privacy'>{t('footer:privacy')}</Link></div>
          {/* i18n?.language === 'ru' && <div role='listitem' className='item'><Link to='/terms-tickets-seller'>{t('footer:termsTicketsSeller')}</Link></div>}
          {i18n?.language === 'ru' && <div role='listitem' className='item'><Link to='/terms-tickets'>{t('footer:termsTickets')}</Link></div> */}
        </div>
      </div>
    </div>
  </div>)
}

export default Footer
