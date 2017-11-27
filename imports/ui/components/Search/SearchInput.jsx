import React from 'react'
import { translate } from 'react-i18next'
import { Link, withRouter } from 'react-router-dom'
import { Search, Grid, Image } from 'semantic-ui-react'
import { graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import ReactGA from 'react-ga'

class SearchInput extends React.Component {
  componentWillMount () {
    this.resetComponent()
  }

  resetComponent = () => {
    this.setState({
      isLoading: false,
      keyword: '',
      resultUsers: [],
      resultPosts: [],
    })
    this.searchTimer = null
  }

  categoryRenderer = ({ name }) => {
    if (name === 'SearchFor') {
      return (<div />)
    } else {
      let linkToSearch = `/search/users/${this.state.keyword}`

      if (name === 'POSTS') {
        linkToSearch = `/search/posts/${this.state.keyword}`
      }

      return (<div>
        <span>{name}</span>
        <Link to={linkToSearch} className='search-more-link'>
          {this.props.t('common:more')}
        </Link>
      </div>)
    }
  }

  resultRenderer = ({ title, description, image }) => {
    // Hack description === link to search object (user or post)
    return (<Link className={image ? '' : 'no-result'} to={description}>
      {image
        ? <div className='image'>
          <Image avatar src={image} />
        </div>
        : null
      }
      <div className='content'>
        <div className='title'>{title}</div>
      </div>
    </Link>)
  }

  handleSearchChange = (e, data) => {
    const keyword = data.value
    if (keyword.length < 1) return this.resetComponent()

    clearTimeout(this.searchTimer)
    this.setState({ isLoading: true, keyword })

    const vars = {
      keyword: keyword
    }

    this.searchTimer = setTimeout(() => {
      ReactGA.event({
        category: 'User',
        action: 'Search',
        value: keyword
      })
      this.runSearch(vars)
    }, 750)
  }

  runSearch = (vars) => {
    // Search Users
    let query = gql`
      query searchUsers($keyword: String!) {
        searchUsers(keyword: $keyword) {
          _id
          username
          profile {
            name
            image
          }
        }
      }
    `

    this.props.client.query({
      query: query,
      variables: vars,
      activeCache: true
    }).then((graphQLResult) => {
      const { errors, data } = graphQLResult

      if (errors) {
      } else {
        const resultUsers = data.searchUsers.map((user) => ({
          'title': user.profile.name,
          'description': `/u/${user.username}`,
          'image': user.profile.image.replace('_full_', '_middle_'),
          'price': 0
        })
        )
        this.setState({
          isLoading: false,
          resultUsers
        })
      }
    }).catch((err) => {
      console.log(err)
    })

    // Search Posts
    query = gql`
      query searchPosts($keyword: String!) {
        searchPosts(
          keyword: $keyword
        ) {
          _id
          title
          coverImg
        }
      }
    `
    this.props.client.query({
      query: query,
      variables: vars,
      activeCache: true
    }).then((graphQLResult) => {
      const { errors, data } = graphQLResult

      if (errors) {
      } else {
        const resultPosts = data.searchPosts.map((post) => ({
          'title': post.title,
          'description': `/p/${post._id}/${post.slug}`,
          'image': post.coverImg ? post.coverImg.replace('_full_', '_thumb_') : 'https://cdnryfma.s3.amazonaws.com/defaults/icons/default_small_avatar.jpg',
          'price': ''
        })
        )
        this.setState({
          isLoading: false,
          resultPosts
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  render () {
    const { t } = this.props
    const { isLoading, keyword, resultUsers, resultPosts } = this.state

    const results = resultUsers.length > 0 || resultPosts.length > 0
      ? {
        'SearchFor': {
          'name': 'SearchFor',
          'results': [{
            'title': `${t('common:search.searchFor')} '${keyword}'`,
            'description': `/search/users/${keyword}`,
            'image': '',
            'price': ''
          }]
        },
        'Users': {
          'name': 'USERS',
          'results': resultUsers.length > 0
            ? resultUsers
            : (isLoading
              ? [{
                'title': t('common:search.common:searching'),
                'description': '',
                'image': '',
                'price': ''
              }]
              : [{
                'title': t('common:search.emptyUserHeader'),
                'description': '',
                'image': '',
                'price': ''
              }]
            )
        },
        'Posts': {
          'name': 'POSTS',
          'results': resultPosts.length > 0
            ? resultPosts
            : (isLoading
              ? [{
                'title': t('common:searching'),
                'description': '',
                'image': '',
                'price': ''
              }]
              : [{
                'title': t('common:search.emptyPostHeader'),
                'description': '',
                'image': '',
                'price': ''
              }]
            )
        }
      }
      : {}

    return (
      <Grid>
        <Grid.Column width={8}>
          <Search
            category
            placeholder={t('common:search.searchMOST')}
            loading={isLoading}
            minCharacters='2'
            categoryRenderer={this.categoryRenderer}
            resultRenderer={this.resultRenderer}
            onSearchChange={this.handleSearchChange}
            noResultsMessage={t('common:search.noResults')}
            results={results}
            value={keyword}
          />
        </Grid.Column>
      </Grid>
    )
  }
}

const searchTags = gql`
  mutation searchTags($keyword: String!) {
    searchTags(
      keyword: $keyword
    ) {
      name
    }
  }
`

const SearchInputWithData = graphql(searchTags, {
  props ({ mutate }) {
    return {
      searchTags ({ keyword }) {
        return mutate({ variables: { keyword } })
      }
    }
  }
})(SearchInput)

export default translate()(withApollo(withRouter(SearchInputWithData)))
