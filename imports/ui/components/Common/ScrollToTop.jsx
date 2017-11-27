import React from 'react'
import { withRouter } from 'react-router-dom'

class ScrollToTop extends React.Component {
  componentWillReceiveProps (nextProps) {
    const { location, history: { action } } = nextProps
    if (location !== this.props.location && action === 'PUSH') {
      // new navigation - scroll to top
      window.scrollTo(0, 0)
    }

    // eventually we might want to try setting up some scroll logic for 'POP'
    // events (back button) to re-set the previous scroll position
  }

  render () {
    return null
  }
}

export default withRouter(ScrollToTop)
