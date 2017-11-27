import React from 'react'
import { Link } from 'react-router-dom'
import { Item, Label, Icon } from 'semantic-ui-react'

const { Extra } = Item

const PostTag = ({ tags }) => {
  return (
    <Extra className='tags'>
      <dl>
        {
          tags.map((tag, i) => (
            <dd key={i} itemProp='keywords'>
              <Label className='post-tag'>
                <Link to={`/tags/${tag._id}/${tag.name}`}>
                  <Icon name='hashtag' />
                  {tag.name}
                </Link>
              </Label>
            </dd>
          ))
        }
      </dl>
    </Extra>
  )
}

export default PostTag
