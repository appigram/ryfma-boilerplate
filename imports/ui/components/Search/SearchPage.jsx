import React from 'react'
import { translate } from 'react-i18next'
import { Link, withRouter } from 'react-router-dom'
import { Grid, List, Form } from 'semantic-ui-react'
import Loader from '../Common/Loader'
import debounce from 'lodash.debounce'
import SearchUsersResult from './SearchUsersResult'
import SearchPostsResult from './SearchPostsResult'
import SEO from '../Common/SEO'
import ReactGA from 'react-ga'

class SearchPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeSearch: this.props.match.params.searchType || 'users',
      keyword: this.props.match.params.keyword
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.match.params.searchType !== nextProps.match.params.searchType) {
      this.setState({
        activeSearch: nextProps.match.params.searchType
      })
    }
  }

  handleSearchChange = debounce((e, keyword) => {
    ReactGA.event({
      category: 'User',
      action: 'SearchPage',
      value: keyword.value
    })
    this.setState({ keyword: keyword.value })
  }, 750);

  render () {
    const { data, loading, error, children, currUser, t } = this.props

    if (loading) {
      return <Loader />
    }

    if (error) {
      return <div>Error: {error.reason}</div>
    }
    const { activeSearch, keyword } = this.state

    let searchResult = <SearchUsersResult keyword={keyword} currUser={currUser} />
    if (activeSearch === 'posts') {
      searchResult = <SearchPostsResult keyword={keyword} />
    }

    return (<div className='page-content search-page'>
      {this.state.keyword
        ? <SEO
          schema='SearchResultsPage'
          title={t('common:search.searchFor') + ' "' + this.state.keyword + '" на MO.ST'}
          description={t('common:search.searchFor') + ' "' + this.state.keyword + '" на MO.ST'}
          path={`search/${activeSearch}/${this.state.keyword}`}
          contentType='website'
        />
        : <SEO
          schema='SearchResultsPage'
          title={t('common:search.searchFor')}
          description={t('common:search.searchFor')}
          path={`search`}
          contentType='website'
        />
      }
      <Grid container columns={1}>
        <Grid.Column mobile={16} tablet={16} computer={16}>
          <Form>
            <Form.Input placeholder={t('common:search.searchMO.ST')} className='search-field' defaultValue={keyword} onChange={this.handleSearchChange} />
          </Form>
        </Grid.Column>
      </Grid>
      {this.state.keyword &&
        <Grid container columns={2}>
          <Grid.Column mobile={16} tablet={8} computer={11}>
            <div className='search-results'>
              <List className='list-actions' link horizontal>
                <List.Item className={activeSearch === 'users' ? 'active' : ''}>
                  <Link to={`/search/users/${keyword}`}>
                    {t('common:search.searchByUsers')}
                  </Link>
                </List.Item>
                <List.Item className={activeSearch === 'posts' ? 'active' : ''}>
                  <Link to={`/search/posts/${keyword}`}>
                    {t('common:search.searchByPosts')}
                  </Link>
                </List.Item>
              </List>
              {searchResult}
            </div>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={8} computer={5} />
        </Grid>
      }
    </div>
    )
  }
}

export default translate()(withRouter(SearchPage))
