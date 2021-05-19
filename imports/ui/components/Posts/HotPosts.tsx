import React from 'react'
import { useTranslation } from 'react-i18next'
import Sidebar from '../Sidebar/Sidebar'
import PostsList from '/imports/ui/components/Posts/PostsList'
import PostsListMenu from '/imports/ui/components/Posts/PostsListMenu'
import SEO from '/imports/ui/components/Common/SEO'
import { useSettings } from '/imports/hooks'

function HotPosts () {
  const [t] = useTranslation('post')
  const { isMobile, feedView, setFeedView } = useSettings()

  const handleChangeView = (viewType) => (e) => setFeedView(viewType)

  return (
    <div className='ui container'>
      <SEO
        schema='ItemList'
        title={`${t('seoHotPostTitle')} - Ryfma`}
        description={`${t('seoHotPostDesc')} - Ryfma`}
        path='hot'
        contentType='website'
      />
      {!isMobile
        ? <div className='ui two column grid post-list-wrapper'>
          <div className='eleven wide column'>
            <PostsListMenu isActive='hot' activeView={feedView} handleChangeView={handleChangeView} />
            <div className='ui segment'>
              <PostsList type='commented' duration='month' showNewPostsButton viewMode={feedView} />
            </div>
          </div>
          <div className='five wide column'>
            <Sidebar />
          </div>
        </div>
        : <div className='ui one column grid post-list-wrapper'>
          <div className='sixteen wide column'>
            <PostsListMenu isActive='hot' activeView={feedView} handleChangeView={handleChangeView} />
            <div className='ui segment'>
              <PostsList type='commented' duration='month' showNewPostsButton viewMode={feedView} />
            </div>
          </div>
        </div>}
    </div>
  )
}

export default HotPosts
