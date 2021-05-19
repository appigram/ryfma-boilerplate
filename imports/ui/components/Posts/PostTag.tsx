import React from 'react'
import { Link } from 'react-router-dom'

const PostTag = ({ tags }) => {
  return (
    <nav className='extra tags'>
      <ul>
        {
          tags.map((tag, i) => (
            <li key={i} itemProp='keywords'>
              <Link rel="tag" to={`/tags/${tag._id}/${tag.name}`} className='ui label post-tag'>
                {tag.name}
              </Link>
            </li>
          ))
        }
      </ul>
    </nav>
  )
}

export default PostTag
