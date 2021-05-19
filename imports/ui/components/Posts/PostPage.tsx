import React from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, Link, useParams, useLocation } from 'react-router-dom'
import SEO from '/imports/ui/components/Common/SEO'
import PostPageContent from './PostPageContent'
import PostPagePlaceholder from './PostPagePlaceholder'
import AdvBanner from '/imports/ui/components/Adv/AdvBanner'
import { useQuery } from '@apollo/client/react'
import getPostInfo from '/imports/graphqls/queries/Post/getPostInfo'
import { useSettings } from '/imports/hooks'
import getQueryParam from '/lib/utils/helpers/getQueryParam'

function PostPage ({ staticContext }) {
  const [t] = useTranslation('post')
  const location = useLocation()
  const { postId, slug } = useParams()
  const { isMobile, isAMP } = useSettings()
  const forceFetch = getQueryParam(location.search, 'refresh')

  const {loading, error, data} = useQuery(getPostInfo, {
    variables: {
      postId: postId,
      noCache: !!forceFetch
    },
    fetchPolicy: forceFetch ? 'network-only' : 'cache-first'
  })

  // console.log('loading: ', loading)
  // console.log('=== PostPage data: ', !!data)

  if (loading) {
    return <PostPagePlaceholder />
  }

  if (error || !(data && data.getPost)) {
    if (staticContext) {
      staticContext.status = 404
    }
    return (<div className='ui container'>
      <SEO
        schema='Article'
        title={t('postNotFoundTitle')}
        description={t('postNotFoundDesc')}
        path={`p/${postId}/${slug}`}
        contentType='article'
      />
      <div className='item post-page error-content'>
        <AdvBanner adType='postPageNative' statId={59} />
        <div className='content'>
          <img src='https://cdn.ryfma.com/defaults/icons/ryfma-404.png' />
          <h1>{t('postNotFoundTitle')}</h1>
          <p>{t('postNotFoundDesc')}</p>
          <Link to='/'>{t('postNotFoundLink')}</Link>
        </div>
      </div>
    </div>)
  }

  if (data.getPost.status === 3) {
    let redirectTo = data.getPost.redirectTo || '/'
    if (isAMP) {
      redirectTo = '/amp' + redirectTo
    }
    if (staticContext) {
      staticContext.status = 301
      staticContext.redirectTo = redirectTo
    }
    return <Redirect to={redirectTo} />
  }

  if (data.getPost.isBlocked) {
    return (<div className='ui container'>
      <SEO
        schema='Article'
        title={t('postAccessDeniedTitle')}
        description={t('postAccessDeniedDesc')}
        path={`p/${postId}/${slug}`}
        contentType='article'
      />
      <div className='item post-page error-content'>
        <AdvBanner adType='postPageNative' statId={60} />
        <div className='content'>
          <img src='https://cdn.ryfma.com/defaults/icons/ryfma-403.png'  />
          <h1>{t('postAccessDeniedTitle')}</h1>
          <p>{t('postAccessDeniedDesc')}</p>
          <Link to='/'>{t('postNotFoundLink')}</Link>
        </div>
      </div>
    </div>)
  }

  const post = data.getPost

  return (
    <PostPageContent post={post} isMobile={isMobile} isAMP={isAMP} postId={postId} location={location} />
  )
}

export default PostPage
