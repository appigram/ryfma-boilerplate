import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import PostsListMenu from '/imports/ui/components/Posts/PostsListMenu'
import PostsList from '/imports/ui/components/Posts/PostsList'
import SEO from '/imports/ui/components/Common/SEO'
import LazyLoadOrChildren from '/imports/ui/components/Common/LazyLoadOrChildren'
import AdvBanner from '/imports/ui/components/Adv/AdvBanner'
import EditorsPosts from './EditorsPosts'
import Tags from './Tags'
import ClassicUsers from './ClassicUsers'
import RecommendedUsers from './RecommendedUsers'
import PopularBooks from './PopularBooks'

import { useAuth, useSettings } from '/imports/hooks'

function ExploreMobile () {
  const [t] = useTranslation('home')
  const { currUserId } = useAuth()
  const { isMobile, feedView, setFeedView } = useSettings()

  const handleChangeView = (viewType) => (e) => setFeedView(viewType)

  const posts = !currUserId
    ? <PostsList type='latest' withImage limit={10} viewMode={feedView} />
    : <PostsList type='following' userId={currUserId} viewMode={feedView} />

  return (<div className='explore-page'>
    <SEO
      schema='WebPage'
      title={t('seoTitle')}
      description={t('seoDesc')}
      path='/'
      contentType='website'
      category='ryfma'
      tags={t('seoKeywords')}
      twitter='ryfma'
      author='https://ryfma.com/u/ryfma'
    />
    {!currUserId && <header className='home-block'>
      <div className='information'>
        <h1 className='ui header'>
          {t('homeMainHeader')}
        </h1>
        <div className='image-wrapper'><img src='https://cdn.ryfma.com/defaults/landings/home/home_screen_1.png' alt={t('homeMainSubheader1')} title={t('homeMainSubheader1')} width='260' height='260' decoding='async' /></div>
        <p className='lead'>{t('homeMainSubheader1')}</p>
        <p className='lead'>{t('homeMainSubheader2')}</p>
        <Link to={'/login'} className='ui button primary'>{t('getStarted')}</Link>
      </div>
    </header>}
    <div className={currUserId ? 'ui container explore-page-inner isLogged' : 'ui container explore-page-inner'}>

      {!currUserId && <ClassicUsers isMobile={isMobile} />}

      {currUserId && <RecommendedUsers isMobile={isMobile} />}

      {/* <div className='pick top-stories'>
        <div className='header'>
          <h2>{t('common:shortStories')}</h2>
          <Link to='/tags/DD7Tyx7HNporNjEpS/%D0%BA%D1%80%D0%B0%D1%82%D0%BA%D0%BE%D0%B5%20%D1%81%D0%BE%D0%B4%D0%B5%D1%80%D0%B6%D0%B0%D0%BD%D0%B8%D0%B5' className='more-link' target='_blank'>Больше</Link>
        </div>
        <CuratedPosts isMobile={isMobile} />
      </div> */}

      {!currUserId && <LazyLoadOrChildren
        height={120}
        offset={100}
        once
        placeholder={null}
      >
        <EditorsPosts isMobile={isMobile} />
      </LazyLoadOrChildren>}

      <LazyLoadOrChildren
        height={153}
        offset={100}
        once
        placeholder={<div key='a_block' className='fullwidth_block' />}
      >
        <div key='a_block' className='fullwidth_block'>
          <AdvBanner adType='toplong' statId={132} />
        </div>
      </LazyLoadOrChildren>

      <PopularBooks isMobile={isMobile} currUserId={currUserId} />

      {!currUserId && <Tags isMobile={isMobile} />}

      {/* <LazyLoadOrChildren
        height={235}
        offset={200}
        once
        placeholder={null}
      >
      <div className='pick top-audio'>
        <h2>{t('common:audio')}</h2>
        <Audios isMobile={isMobile} />
      </div>
      </LazyLoadOrChildren>
      <LazyLoadOrChildren
        key='b_block'
        height={235}
        offset={200}
        once
        placeholder={null}
      >
        <div className='fullwidth_block'>
          <AdvBanner adType='multiList' statId={120} />
        </div>
      </LazyLoadOrChildren>
      <LazyLoadOrChildren
        height={235}
        offset={200}
        once
        placeholder={null}
      >
      <div className='pick top-videos'>
        <h2>{t('common:video')}</h2>
        <Videos isMobile={isMobile} />
      </div>
      </LazyLoadOrChildren> */}

      {!currUserId && <LazyLoadOrChildren
        height={235}
        offset={200}
        once
        placeholder={<div key='b_block' className='fullwidth_block' />}
      >
        <div key='b_block' className='fullwidth_block'>
          <AdvBanner adType='toplong' statId={133} />
        </div>
      </LazyLoadOrChildren>}

      <LazyLoadOrChildren
        height={235}
        offset={200}
        once
        placeholder={null}
      >
      <div className={currUserId ? 'top-user-posts pick isLogged' : 'top-user-posts pick'}>
        {!currUserId && <div className='header'>
          <h2>{t('common:latestPosts')}</h2>
        </div>}
        <div className='ui one column grid post-list-wrapper'>
          <div className='sixteen wide column'>
            <PostsListMenu isActive='home' activeView={feedView} handleChangeView={handleChangeView} />
            <div className='ui segment posts-list-wrapper'>
              {posts}
            </div>
          </div>
          <div style={{ clear: 'both' }} />
        </div>
      </div>
      </LazyLoadOrChildren>
    </div>
  </div>)
}

export default ExploreMobile
