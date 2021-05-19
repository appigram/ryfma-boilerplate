import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import LazyLoadOrChildren from '/imports/ui/components/Common/LazyLoadOrChildren'
import EmptyBlock from '/imports/ui/components/Common/EmptyBlock'
import PostPlaceholder from './PostPlaceholder'
import PostsListItem from './PostsListItem'
// import PostsListItemShort from './PostsListItemShort'
import AdvBanner from '/imports/ui/components/Adv/AdvBanner'
import PostPromotion from './PostPromotion'
import { useQuery } from '@apollo/client/react'
import { useAuth, useSettings } from '/imports/hooks'
import getLatestPosts from '/imports/graphqls/queries/Post/getLatestPosts'

const POSTS_PER_PAGE = 16
const CHECK_POSTS_TIMEOUT = 1000 * 60 * 10 // 10 min

let PostsListItemShort = () => null

function PostsList ({ viewMode, hideAds, userId, albumId, isPromo, type, tagId, festId, duration, withImage, personal = false, keyword, status, showNewPostsButton = false, skip = 0, limit = POSTS_PER_PAGE, forceFetch = false }) {
  const [t] = useTranslation('post')
  const { currUser, currUserId } = useAuth()
  const { isAMP, isMobile, isBot } = useSettings()
  // const [skipPosts, setSkipPosts] = useState(0)
  const [infinityLoading, setInfinityLoading] = useState(true)
  const [checkPostsAgain, setCheckPostsAgain] = useState(false)
  const [isPostsListItemShort, setPostsListItemShort] = useState(false)

  let postsFetchedTime = new Date()

  const { loading, error, data, refetch, fetchMore } = useQuery(getLatestPosts, {
    variables: {
      type,
      userId,
      albumId,
      tagId,
      festId,
      duration,
      withImage,
      personal,
      keyword,
      status,
      skip,
      limit: viewMode === 'compact' ? 32 : limit
    },
    fetchPolicy: forceFetch ? 'network-only' : 'cache-first'
  })

  useEffect(() => {
    if (viewMode === 'compact') {
      import('/imports/ui/components/Posts/PostsListItemShort').then(module => {
        PostsListItemShort = module.default
        setPostsListItemShort(true)
      })
    }
  }, [viewMode])

  const fetchMorePosts = (skipPosts) => () => {
    fetchMore({
      query: getLatestPosts,
      variables: {
        type,
        userId,
        albumId,
        tagId,
        festId,
        withImage,
        duration,
        personal,
        keyword,
        status,
        skip: skipPosts,
        limit: viewMode === 'compact' ? 32 : limit
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newPosts = fetchMoreResult.posts
        // setSkipPosts(skipPosts)
        setInfinityLoading(newPosts.length === limit)
        postsFetchedTime = new Date()
        return newPosts.length
          ? Object.assign({}, previousResult, {
            posts: [...previousResult.posts, ...newPosts]
          })
          : previousResult
      }
    })
  }

  useEffect(() => {
    if (showNewPostsButton) {
      const checkPostsInterval = setInterval(() => {
        const currDate = new Date()
        const diffCheckTime = currDate.getTime() - postsFetchedTime.getTime()
        setCheckPostsAgain(diffCheckTime > CHECK_POSTS_TIMEOUT)
      }, CHECK_POSTS_TIMEOUT)

      return () => clearInterval(checkPostsInterval)
    }
  }, [])

  const handleRefetchButton = () => {
    postsFetchedTime = new Date()
    setCheckPostsAgain(false)
    refetch()
  }

  if (loading || !data) {
    postsFetchedTime = new Date()
    return (<div className='ui divided items post-list'>
      {Array.from(Array(limit).keys()).map((_post, index) => {
        return (<div key={index}>
          <PostPlaceholder key={index} />
        </div>)
      })}
    </div>)
  }

  if (error) {
    return (<div className='error-loading'>
      Что-то пошло не так :(
      <a href='javascript:window.location.reload();'>Нажмите здесь, чтобы исправить проблему</a>
    </div>)
  }

  const posts = data.posts

  if (posts.length === 0 && type === 'following') {
    return (<div className='following'>
      <EmptyBlock iconName='newspaper' header={t('noPosts')} text={t('postNotFoundFollowing')} />
      <Link className='ui button primary' to='/search'><i aria-hidden='true' className='icon search' />{t('findAuthors')}</Link>
    </div>)
  } else if (posts.length === 0) {
    return (<div>
      <EmptyBlock iconName='newspaper' header={t('noPosts')} text={userId ? (currUserId === userId ? <Link to='/new-post'>{t('writeFirstPost')}</Link> : t('userNoPosts')) : t('postNotFound')} />
    </div>)
  }

  let sponsorOf = []
  if (currUser) {
    if (currUser.sponsorOf) {
      sponsorOf = currUser.sponsorOf
    }
  }

  return (
    <div className='ui divided items post-list' itemScope itemType="https://schema.org/ItemList">
      {/* showStories ? <Stories /> : null */}
      {checkPostsAgain && <div className='check-new-posts-wrapper'>
        <div className='check-new-posts'>
          <button onClick={handleRefetchButton}>{t('common:newPosts')}</button>
        </div>
      </div>}
      {posts.map((post, index) => {
        const isOwner = currUser ? currUser._id === post.author._id : false
        const coins = currUser ? currUser.coins : 0
        const postItem = viewMode === 'compact'
          ? <PostsListItemShort position={index+1} post={post} currCoins={coins} userId={userId} isPromo={isPromo} isOwner={isOwner} sponsorOf={sponsorOf} />
          : <PostsListItem position={index+1} post={post} currCoins={currUser ? currUser.coins : 0} userId={userId}  isOwner={isOwner} sponsorOf={sponsorOf} postType={type} isAMP={isAMP} />

        let showAdsBlock = (index === 2) || (index % 7 === 0 && index > 0)
        let showPromoBlock = (index === 3 && !hideAds) || (index % 10 === 0 && index > 0 && !hideAds)
        if (albumId) {
          showAdsBlock = (index === 3) || (index % 16 === 0 && index > 0)
        }

        if (viewMode === 'compact'){
          showAdsBlock = (index === 3) || (index % 16 === 0 && index > 0)
          showPromoBlock =  (index === 4 && !hideAds) || (index % 20 === 0 && index > 0 && !hideAds)
        }

        return (
          <div key={post._id}>
            {showAdsBlock && <LazyLoadOrChildren
              height={235}
              offset={isMobile ? 400 : 300} // 13%/46% visibility
              once
              placeholder={null}
              >
                <AdvBanner adType='postList' pageNum={index} statId={71} />
              </LazyLoadOrChildren>
            }
            {postItem}
            {showPromoBlock && !isBot && <PostPromotion postKey={post._id} />}
          </div>
        )
      })}
      {infinityLoading && posts.length > (limit - 1) && <div className='loadmore-button' onClick={fetchMorePosts(posts.length)}>
        <i aria-hidden='true' className='icon sync' />
        {t('common:showMore')}
      </div>}
    </div>
  )
}

export default PostsList
