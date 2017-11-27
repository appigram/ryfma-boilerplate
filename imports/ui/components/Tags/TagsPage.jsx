import React from 'react'
import { withRouter } from 'react-router-dom'
import { translate } from 'react-i18next'
import { Container, Grid } from 'semantic-ui-react'
import Sidebar from '../Sidebar/Sidebar'
import PostsList from '../Posts/PostsList'
import SEO from '../Common/SEO'
import { isMobile } from '/lib/utils/deviceDetect'

class TagsPage extends React.Component {
  render () {
    const { t } = this.props
    return (
      <Container>
        <SEO
          schema='ItemList'
          title={'Most recent posts tagged by ' + this.props.match.params.tagName}
          description={'Most recent posts tagged by ' + this.props.match.params.tagName}
          path={`tags/${this.props.match.params.tagId}/${this.props.match.params.tagName}`}
          contentType='website'
          tags={this.props.match.params.tagName}
        />
        {!isMobile()
          ? <Grid columns={2} className='post-list-wrapper'>
            <Grid.Column width={12}>
              <div className='ui segment'>
                <div className='tags-search-header'>{t('description')} <b>#{this.props.match.params.tagName}</b></div>
                <PostsList
                  tagId={this.props.match.params.tagId}
                />
              </div>
            </Grid.Column>
            <Grid.Column width={4}>
              <Sidebar />
            </Grid.Column>
          </Grid>
          : <Grid columns={1} className='post-list-wrapper'>
            <Grid.Column width={16}>
              <div className='ui segment'>
                <div className='tags-search-header'>{t('description')} <b>#{this.props.match.params.tagName}</b></div>
                <PostsList
                  tagId={this.props.match.params.tagId}
                />
              </div>
            </Grid.Column>
          </Grid>
        }
      </Container>
    )
  }
}

export default translate('tagsPage')(withRouter(TagsPage))
