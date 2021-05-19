import React from 'react'
import { Link } from 'react-router-dom'

const PostShortItem = ({ post, author }) => {
  return (
    <div className='post-list-item short-comment-item item'>
      <div className='content'>
        <Link to={`/p/${post._id}/${post.slug}`} title={post.title}>
          <div className='post-info'>
            <div className='post-title'>{post.title}</div>
            <div className='post-author'>{author.profile.name}</div>
          </div>
          <div className='post-stat'>
            <span>
              <i aria-hidden='true' className='icon heart grey' />
              {post.likeCount}
            </span>
            <span>
              <i aria-hidden='true' className='icon comments grey' />
              {post.commentsCount}
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default PostShortItem
