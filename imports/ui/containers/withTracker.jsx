import React, { Component } from 'react'
import ReactGa from 'react-ga'

ReactGa.initialize('UA-64039800-1')

const withTracker = (WrappedComponent, options = {}) => {
  const trackPage = page => {
    ReactGa.set({
      page,
      ...options
    })
    ReactGa.pageview(page)
  }

  const HOC = class extends Component {
    componentDidMount () {
      const page = this.props.location.pathname
      if (typeof window !== 'undefined') {
        // console.log('Track new route!')
        trackPage(page)
      }
    }

    componentWillReceiveProps (nextProps) {
      // const currentPage = this.props.location.pathname
      const nextPage = nextProps.location.pathname

      // if (currentPage !== nextPage) {
      if (typeof window !== 'undefined') {
        // console.log('Track new route!')
        trackPage(nextPage)
      }
      // }
    }

    render () {
      return <WrappedComponent {...this.props} />
    }
  }

  return HOC
}

export default withTracker
