import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import getNextPrevPosts from '/imports/graphqls/queries/Post/getNextPrevPosts'

const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
]

function ReadNextPrevPosts({ type, postId, postCreated, isAMP }) {
  const [t] = useTranslation('post')

  const { loading, error, data } = useQuery(getNextPrevPosts, {
    skip: !postId,
    variables: {
      postId,
    }
  })

  if (loading) {
    return <div />
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const readNextPrevPosts = data.getNextPrevPosts

  if (readNextPrevPosts.length === 0) {
    return null
  }

  const relatedClassName = type === 'horizontal' ? 'ui card recommended horizontal prev-next-posts' : 'ui card recommended vertical prev-next-posts'

  return (
    <div className={relatedClassName}>
      <div className='content related-wrapper'>
        <div className='header'>
          {t('readNextPrevPosts')}
        </div>
        <div className='content body'>
          <div className='related-sublings'>
            <ul className={isAMP ? 'ui items amp-list' : 'ui items'}>
              {readNextPrevPosts.map((post) => {
                const pubDate = new Date(post.postedAt)
                const publicationDate = pubDate.getDate() + ' ' + MONTHS[pubDate.getMonth()] + ' ' + pubDate.getFullYear()
                let pubStatus = t('newer')
                if (post.postedAt < postCreated) {
                  pubStatus = t('older')
                }
                return (<li key={post._id} className='item'>
                  {!isAMP ?
                    <Link className='image-link' to={`/p/${post._id}/${post.slug}`} title={post.title}>
                      <img src={post.coverImg || 'https://cdn.ryfma.com/defaults/icons/default_back_full.jpg'} alt={post.title} title={post.title} width='330' height='122' decoding='async' loading='lazy' />
                    </Link>
                    :
                    <Link className='image-link' to={`/p/${post._id}/${post.slug}`} style={{ position: 'relative', width: '100%', height: '168px' }}><img src={post.coverImg || 'https://cdn.ryfma.com/defaults/icons/default_back_full.jpg'} alt={post.title} title={post.title} width='364' height='140' decoding='async' loading='lazy' /></Link>
                  }
                  <div className='content'>
                    <Link className='content-link' to={`/p/${post._id}/${post.slug}`} title={post.title}>
                      <h3>{post.title}</h3>
                    </Link>
                    <span className='pub-date'>{publicationDate}&nbsp;({pubStatus})</span>
                  </div>
                </li>)
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReadNextPrevPosts
