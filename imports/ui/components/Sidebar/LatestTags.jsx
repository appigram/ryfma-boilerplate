import React from 'react'
import { translate } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Card, Icon } from 'semantic-ui-react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const LatestTagsComponent = ({ data, t }) => {
  if (data.loading) {
    return <div />
  }

  if (data.error) {
    return <div>Error: { data.error.message }</div>
  }

  return (
    <Card className='sidebar-card latest-tags'>
      <Card.Content>
        <Card.Header>
          {t('common:sidebar.latestTags')}
        </Card.Header>
      </Card.Content>
      <Card.Content className='body'>
        {data.latestTags.length > 0 ? data.latestTags.map((tag) => (
          <Link to={`/tags/${tag._id}/${tag.name}`}><Icon name='hashtag ' />{tag.name}</Link>
        ))
        :
        'No tags yet'
        }
      </Card.Content>
    </Card>
  )
}

const getLatestTags = gql`
  query getLatestTags {
    latestTags {
      _id
      name
      slug
    }
  }
`

const LatestTags = graphql(getLatestTags)(LatestTagsComponent)

export default translate()(LatestTags)
