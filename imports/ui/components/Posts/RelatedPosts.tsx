import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Avatar from '/imports/ui/components/Common/Avatar'
import { useQuery } from '@apollo/client/react'
import getRelatedPosts from '/imports/graphqls/queries/Post/getRelatedPosts'
import AdvBanner from '/imports/ui/components/Adv/AdvBanner'
import PostPromotion from './PostPromotion'

function RelatedPosts ({ type, post, isAMP }) {
  const [t] = useTranslation('post')
  const tagsIds = post.tags.map(item => item._id)

  const {loading, error, data} = useQuery(getRelatedPosts, {
    skip: !post._id,
    variables: {
      postId: post._id,
      tags: tagsIds
    }
  })

  if (loading) {
    return <div />
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const relatedPosts = data.relatedPosts

  if (relatedPosts.length === 0) {
    return null
  }

  const relatedClassName = type === 'horizontal' ? 'ui card recommended horizontal related-posts' : 'ui card recommended vertical related-posts'
  const tags = post.tags

  const renderPostItem = (item, position) => {
    let similarTag = ''
    for (let i = 0; i < tags.length; i++) {
      for (let j = 0; j < item.tags.length; j++) {
        if (tags[i]._id === item.tags[j]._id) {
          similarTag = tags[i].name
          break
        }
      }
    }
    return (<div key={item._id} className='item' itemScope itemProp="itemListElement" itemType="https://schema.org/ListItem">
      <meta itemProp="position" content={position} />
      {!isAMP ?
        <Link to={`/p/${item._id}/${item.slug}`} title={item.title} itemProp='url'>
          <img src={item.coverImg || 'https://cdn.ryfma.com/defaults/icons/default_back_full.jpg'} alt={item.title} title={item.author.profile.name + ' - ' + item.title} width='364' height='168' decoding='async' loading='lazy'/>
        </Link>
        :
        <Link to={`/p/${item._id}/${item.slug}`} style={{position: 'relative', width:'100%', height: '168px'}} title={item.title} itemProp='url'><img src={item.coverImg || 'https://cdn.ryfma.com/defaults/icons/default_back_full.jpg'} alt={item.title} title={item.author.profile.name + ' - ' + item.title} width='364' height='140'/></Link>
      }
      <div className='content'>
        {similarTag ? <p>{t('similarTag')}{similarTag}</p> : <p>{t('youCanLike')}</p>}
        <Link className='content-link' to={`/p/${item._id}/${item.slug}`} title={item.title}>
          <h3>{item.title}</h3>
        </Link>
        <div className='user-link item'>
          <div>
            <Avatar
              image={item.author.profile.image}
              username={item.author.username}
              name={item.author.profile.name}
              roles={item.author.roles}
              type='middle'
              size={44}
              isAMP={isAMP}
              addLazy={true}
              isComment={true}
            />
          </div>
          <Link rel='author' to={`/u/${item.author.username}`} title={item.author.profile.name}>
            <span>{item.author.profile.name}</span>
          </Link>
        </div>
      </div>
    </div>)
  }

  const renderPosts = [<PostPromotion key={'promoted'} isVertical={true} position={1} />]
  const halfOfPosts = 5 // Math.floor(relatedPosts.length / 2)
  for (let i = 0; i < halfOfPosts; i++) {
    renderPosts.push(renderPostItem(relatedPosts[i], i + 2))
  }
 
  renderPosts.push(
    <div key='a-block' className='fullwidth_block'>
      <AdvBanner adType='postList' statId={72} />
    </div>)

  for (let i = halfOfPosts; i < relatedPosts.length; i++) {
    renderPosts.push(renderPostItem(relatedPosts[i], i + 2))
  }

  return (
    <div className={relatedClassName}>
      <div className='content related-wrapper'>
        <div className='header'>
          {t('relatedPosts')}
        </div>
        <div className='content body'>
          <div className='ui items' itemScope itemType="https://schema.org/ItemList">
            {renderPosts}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RelatedPosts
