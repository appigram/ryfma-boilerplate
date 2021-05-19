import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Feed } from 'semantic-ui-react'
import { useQuery } from '@apollo/client/react'
import AdvBanner from '/imports/ui/components/Adv/AdvBanner'
import SEO from '/imports/ui/components/Common/SEO'
import TimeAgoExt from '/imports/ui/components/Common/TimeAgoExt'
import Avatar from '/imports/ui/components/Common/Avatar'
// import parseCommentText from '/lib/utils/helpers/parseCommentText'
import GET_LATEST_COMMENTS from '/imports/graphqls/queries/Comment/getLatestComments'
import EmptyBlock from '/imports/ui/components/Common/EmptyBlock'

const COMMENTS_PER_PAGE = 24

function Live () {
  const [t] = useTranslation('comment')
  const [skipComments, setSkipComments] = useState(0)
  const [infinityLoading, setInfinityLoading] = useState(true)
  const { loading, error, data, fetchMore } = useQuery(GET_LATEST_COMMENTS, {
    variables: {
      skip: 0,
      limit: COMMENTS_PER_PAGE
    }
  })

  const fetchMoreComments = (skipComments) => () => {
    fetchMore({
      query: GET_LATEST_COMMENTS,
      variables: {
        skip: skipComments,
        limit: COMMENTS_PER_PAGE
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newComments = fetchMoreResult.getLatestComments
        setSkipComments(skipComments)
        setInfinityLoading(newComments.length === COMMENTS_PER_PAGE)
        return newComments.length
          ? Object.assign({}, previousResult, {
            getLatestComments: [...previousResult.getLatestComments, ...newComments]
          })
          : previousResult
      }
    })
  }

  if (loading) {
    return (<Feed className='loading-event' size='small'>
      <Feed.Event>
        <Feed.Content>
          <Feed.Summary>
            Loading...
          </Feed.Summary>
        </Feed.Content>
      </Feed.Event>
    </Feed>)
  }

  if (error || !data.getLatestComments) {
    return <div>Error: {error.message}</div>
  }

  const comments = data.getLatestComments

  if (comments.length === 0) {
    return (<div>
      <EmptyBlock iconName='comments' header={t('noComments')} text={t('commentNotFound')} />
    </div>)
  }

  return (<div className='notif-page'>
    <SEO
      schema='Webpage'
      title={t('latestCommentsTitle')}
      description={t('latestCommentsDesc')}
      path='live'
      contentType='website'
    />
    <div className='comment-menu-wrapper comments-wrapper latest-comments'>
      <h3>{t('latestCommentsDesc')}</h3>
      {comments.map((comment, index) => {
        const user = comment.author
        const object = JSON.parse(comment.object)
        if (!user || !object) {
          return null
        }

        const avatarImg = user.profile.image ? user.profile.image.replace('_full_', '_small_') : user.profile.image
        const avataObj = <Avatar
          image={avatarImg}
          username={user.username}
          name={user.profile.name}
          roles={user.roles}
          type='small'
        />
        const linkToUser = <Link to={`/u/${user.username}`}>{user.profile.name}</Link>

        const maxCommLength = 130
        let commTextFinal = ''
        let commLength = 0
        comment.content.split(/<\/p>/).map((node, index) => {
          if (index > 4 || commLength > maxCommLength) {
            return
          }
          if (node && node !== '') {
            if ((commLength + node.length - 3) < maxCommLength) {
              commTextFinal += node.trim() + '</p>'
              commLength += (node.length - 3) // except length of <p>
              index = index + 1
            } else {
              const trucnLength = maxCommLength - commLength
              commTextFinal += node.trim().substring(0, trucnLength) + '...</p>'
              commLength += (node.length - 3) // except length of <p>
              index = index + 1
            }
          }
        })

        // const commText = parseCommentText(comment.content, true)

        /* let commTextStyle = 'text'
        if (/\ud83d[\ude00-\ude4f]/g.test(commText)) {
          commTextStyle = 'text emoji-only'
        } */

        let objectLink = null
        let objectLinkReply = null
        if (comment.objectType === 'post') {
          objectLink = <Link to={`/p/${object._id}/${object.slug}`}>{object.title}</Link>
          objectLinkReply = <Link to={`/p/${object._id}/${object.slug}`} className='reply-link'>
            <div dangerouslySetInnerHTML={{ __html: `${commTextFinal}` }} />
          </Link>
        } else if (comment.objectType === 'ask') {
          objectLink = <Link to={`/ask/${object._id}/${object.slug}`}>{object.title}</Link>
          objectLinkReply = <Link to={`/ask/${object._id}/${object.slug}`} className='reply-link'>
            <div dangerouslySetInnerHTML={{ __html: `${commTextFinal}` }} />
          </Link>
        } else if (comment.objectType === 'book') {
          objectLink = <Link to={`/b/${object._id}/${object.slug}`}>{object.title}</Link>
          objectLinkReply = <Link to={`/b/${object._id}/${object.slug}`} className='reply-link'>
            <div dangerouslySetInnerHTML={{ __html: `${commTextFinal}` }} />
          </Link>
        } else if (comment.objectType === 'contest') {
          objectLink = <Link to={`/f/${object.slug}`}>{object.title}</Link>
          objectLinkReply = <Link to={`/f/${object.slug}`} className='reply-link'>
            <div dangerouslySetInnerHTML={{ __html: `${commTextFinal}` }} />
          </Link>
        }

        const commentItem = (<Feed size='small'>
          <Feed.Event>
            <Feed.Content>
              <div className='user-info'>
                {avataObj}
                <div>
                  {linkToUser}
                  <TimeAgoExt date={comment.createdAt} />
                </div>
              </div>
              <Feed.Summary className={comment.commentType === 5 ? 'with-button' : ''}>
                {objectLinkReply}
              </Feed.Summary>
              <div className='post-info'>
                {objectLink}
              </div>
            </Feed.Content>
          </Feed.Event>
        </Feed>)

        return (
          <div key={comment._id}>
            {/* index === 3 && !hideAds && <PromoPost /> */}
            {commentItem}
            {(index === 2) && <AdvBanner adType='postPageNative' statId={121} />}
            {(index % 10 === 0 && index > 0) && <AdvBanner adType='postPageNative' statId={122} />}
          </div>
        )
      })}
      {infinityLoading && comments.length > (COMMENTS_PER_PAGE - 1)
        ? <div className='loadmore-button' onClick={fetchMoreComments(comments.length)}>
          <i aria-hidden='true' className='icon sync' />
          {t('common:showMore')}
        </div>
        : null}
    </div>
  </div>)
}

export default Live
