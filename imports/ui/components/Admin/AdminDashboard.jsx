import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import Loader from '../Common/Loader'
import Pagination from '../Common/Pagination'
import { Header, Table, Icon, Item, Button, Container } from 'semantic-ui-react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import store from '/lib/store'

class AdminDashboard extends React.Component {
  render () {
    const { adminUsersData, adminStatData } = this.props
    if (adminUsersData.loading || adminStatData.loading) {
      return <Loader />
    }

    if (adminUsersData.error || adminStatData.error) {
      return <div>Error: {adminUsersData.error.reason}</div>
    }

    const currUser = JSON.parse(store.getItem('Meteor.currUser'))

    const adminUsers = adminUsersData.adminUsers
    const adminStat = adminStatData.adminStat

    return (
      <Container>
        <Item className='admin-page'>
          <Header as='h1'>MO.ST Users (Total: {adminStat.total}, Today: {adminStat.today}, Week: {adminStat.week}, Month: {adminStat.month}, Year: {adminStat.year})</Header>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>User</Table.HeaderCell>
                <Table.HeaderCell>Registered</Table.HeaderCell>
                <Table.HeaderCell>Username</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Stats</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {adminUsers.items.length > 0
                ? adminUsers.items.map((user, index) => {
                  return (
                    <Table.Row>
                      <Table.Cell>
                        <Item.Group>
                          <Item className='user-info'>
                            <Link className='user-info-link' to={`/u/${user.username}`}>
                              <Item.Image avatar size='tiny' src={user.profile.image ? user.profile.image.replace('_full_', '_middle_') : null} />
                            </Link>
                            <Item.Content verticalAlign='middle'>
                              <div className='user-info-content'>
                                <Item.Header>
                                  <Link to={`/u/${user.username}`}>{user.profile.name}</Link>
                                </Item.Header>
                              </div>
                            </Item.Content>
                          </Item>
                        </Item.Group>
                      </Table.Cell>
                      <Table.Cell>
                        {user.createdAt.replace('GMT+0300 (MSK)', '')}
                      </Table.Cell>
                      <Table.Cell>
                        {user.username}
                      </Table.Cell>
                      <Table.Cell>
                        {user.email}{user.emails[0].verified && <Icon name='check' />}
                      </Table.Cell>
                      <Table.Cell>
                        <ul className='user-stats'>
                          <li>Posts: <b>{user.stats.postsCount || 0}</b></li>
                          <li>Following: <b>{user.stats.followingCount || 0}</b></li>
                          <li>Followers: <b>{user.stats.followersCount || 0}</b></li>
                        </ul>
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          content='Delete'
                          icon='remove user'
                          labelPosition='left'
                          color='red'
                        />
                        <Button
                          content='Ban'
                          icon='ban'
                          labelPosition='left'
                          color='blue'
                        />
                      </Table.Cell>
                    </Table.Row>
                  )
                })
                : 'Users not found'
              }
            </Table.Body>
          </Table>
          {adminUsers.pageCount > 1 && <Pagination pageCount={adminUsers.pageCount} />}
        </Item>
      </Container>
    )
  }
}

const getAdminUsersList = gql`
  query getAdminUsersList( $skip: Int, $limit: Int) {
    adminUsers(skip: $skip, limit: $limit) {
      pageCount
      items {
        _id
        createdAt
        username
        email
        emails {
          verified
        }
        profile {
          name
          karma
          image
        }
        stats {
          postsCount
          followingCount
          followersCount
        }
      }
    }
  }
`

const getAdminStat = gql`
  query getAdminStat {
    adminStat
  }
`

const AdminDashboardWithData = compose(
  graphql(getAdminUsersList, {
    options: (ownProps) => ({
      variables: {
        skip: ownProps.match.params.pageNum ? ownProps.match.params.pageNum * 20 : 0,
        limit: 20
      }
    }),
    name: 'adminUsersData'
  }),
  graphql(getAdminStat, {
    name: 'adminStatData'
  })
)(AdminDashboard)

export default withRouter(AdminDashboardWithData)
