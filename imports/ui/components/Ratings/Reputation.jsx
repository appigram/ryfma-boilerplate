import React from 'react'
import { translate } from 'react-i18next'
import { Link, withRouter } from 'react-router-dom'
import LazyLoad from 'react-lazyload'
import Loader from '../Common/Loader'
import SEO from '../Common/SEO'
import Pagination from '../Common/Pagination'
import { Header, Table, Icon, Item, Popup, Container } from 'semantic-ui-react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

const { Content } = Item

class Reputation extends React.Component {
  componentWillMount () {
    if (this.props.match.params.pageNum === 1) {
      this.props.history.replace('/authors')
    }
  }

  changePage = (nextPage) => {
    if (nextPage === 1) {
      this.props.history.push('/authors')
    } else {
      this.props.history.push(`/authors/${nextPage}`)
    }
  }

  render () {
    const { t } = this.props
    const { loading, error, users } = this.props.data

    if (loading) {
      return <Loader />
    }

    if (error) {
      return <div>Error: { error.reason }</div>
    }

    const pageNum = this.props.match.params.pageNum ? this.props.match.params.pageNum : 1

    return (
      <Container>
        <SEO
          schema='Website'
          title={`${t('seoTitle')} · MO.ST`}
          description={`${t('seoDesc')} · MO.ST`}
          path='authors'
          contentType='website'
        />
        <Item className='ratings-page'>
          <Content>
            <div className='ratings-wrapper-page'>
              <Header as='h1'>{t('header')}</Header>
              <Header.Subheader>
                {t('subheader')}
              </Header.Subheader>
              <Table singleLine>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>{t('rankCellHeader')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('userCellHeader')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('achievementsCellHeader')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('reputationCellHeader')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('changeCellHeader')}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {
                    users.items.length > 0
                      ? users.items.map((item, index) => {
                        const user = item.profile

                        return (
                          <Table.Row>
                            <Table.Cell textAlign='center' width='1' className='rank'>
                              {rank}
                            </Table.Cell>
                            <Table.Cell className='user-info-td'>
                              <Item.Group relaxed>
                                <Item className='user-info'>
                                  <Link className='user-info-link' to={`/u/${item.username}`}>
                                    <LazyLoad height={44} offset={200} once placeholder={<div className='ui tiny avatar image img-placeholder' />}>
                                      <Item.Image avatar size='tiny' src={user.image ? user.image.replace('_full_', '_middle_') : null} />
                                    </LazyLoad>
                                  </Link>
                                  <Item.Content verticalAlign='middle'>
                                    <div className='user-info-content'>
                                      <Item.Header>
                                        <Link to={`/u/${item.username}`}>{user.name}</Link>
                                      </Item.Header>
                                    </div>
                                  </Item.Content>
                                </Item>
                              </Item.Group>
                            </Table.Cell>
                          </Table.Row>
                        )
                      })
                      : t('usersNotFound')
                  }
                </Table.Body>
              </Table>
              {users.pageCount > 1 &&
                <Pagination
                  pageNum={pageNum}
                  pageCount={users.pageCount}
                  changePage={this.changePage}
                />
              }
            </div>
          </Content>
        </Item>
      </Container>
    )
  }
}

const getUsersList = gql`
  query getUsersList($sortType: String, $skip: Int, $limit: Int) {
    users(sortType: $sortType, skip: $skip, limit: $limit) {
      pageCount
      items {
        _id
        username
        profile {
          name
          karma
          nextKarma
          image
          invitesCount
        }
        stats {
          postsCount
          followersCount
          followingCount
          savedCount
          strikeCount
          strikePostsCount
          levitanDownloads
        }
      }
    }
  }
`

const ReputationWithData = compose(
  graphql(getUsersList, {
    options: (ownProps) => ({
      variables: {
        sortType: ownProps.sortType,
        skip: ownProps.match ? (ownProps.match.params.pageNum - 1) * 30 : 0,
        limit: 30
      }
    })
  })
)(Reputation)

export default translate('reputation')(withRouter(ReputationWithData))
