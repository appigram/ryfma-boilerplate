import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Sidebar from '../Sidebar/Sidebar'
import PostsList from '/imports/ui/components/Posts/PostsList'
import PostsListMenu from '/imports/ui/components/Posts/PostsListMenu'
import SEO from '/imports/ui/components/Common/SEO'
import { useSettings } from '/imports/hooks'

function BestPosts ({ activeFilter }) {
  const [t] = useTranslation('post')
  const { isMobile, feedView, setFeedView } = useSettings()
  const [activeBestFilter, setActiveBestFilter] = useState(activeFilter || 'week')

  const handleChangeView = (viewType) => (e) => setFeedView(viewType)

  const handleActiveFilter = (filter) => (e) => setActiveBestFilter(filter)

  return (
    <div className='ui container'>
      <SEO
        schema='ItemList'
        title={`${t('seoBestPostTitle')} - Ryfma`}
        description={`${t('seoBestPostDesc')} - Ryfma`}
        path='best'
        contentType='website'
      />
      {!isMobile
        ? <div className='ui two column grid post-list-wrapper'>
          <div className='eleven wide column'>
            <PostsListMenu isActive='best' activeView={feedView} activeFilter={activeBestFilter} handleChangeView={handleChangeView} handleChangeFilter={handleActiveFilter} />
            <div className='ui segment'>
              <PostsList type='popular' duration={activeBestFilter} showStories viewMode={feedView} />
            </div>
          </div>
          <div className='five wide column'>
            <Sidebar />
          </div>
        </div>
        : <div className='ui one column grid post-list-wrapper'>
          <div className='sixteen wide column'>
            <PostsListMenu isActive='best' activeView={feedView} activeFilter={activeBestFilter} handleChangeView={handleChangeView} handleChangeFilter={handleActiveFilter} />
            <div className='ui segment'>
              <PostsList type='popular' duration={activeBestFilter} showStories viewMode={feedView} />
            </div>
          </div>
        </div>}
    </div>
  )
}

export default BestPosts
