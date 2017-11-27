import React from 'react'
import ReactDOM from 'react-dom'
import Toast from './Toast'
import {defaults, mergeOptions} from './defaults'

const renderToast = (text, type, timeout, color) => {
  const target = document.getElementById(defaults.wrapperId)
  ReactDOM.render(<Toast text={text} timeout={timeout} type={type} color={color} />, target)
}

const hide = () => {
  const target = document.getElementById(defaults.wrapperId)
  ReactDOM.unmountComponentAtNode(target)
}

const show = (text, type, timeout, color) => {
  if (!document.getElementById(defaults.wrapperId).hasChildNodes()) {
    // Use default timeout if not set.
    let renderTimeout = timeout || defaults.timeout

    // Render Component with Props.
    renderToast(text, type, renderTimeout, color)

    if (renderTimeout === -1) {
      return false
    }

    // Unmount react component after the animation finished.
    setTimeout(() => {
      hide()
    }, renderTimeout + defaults.animationDuration)

    return true
  }

  return false
}

export const Notification = {
  error: (message) => {
    if (message.graphQLErrors) {
      show(message.graphQLErrors[0].message, 'error', 10000)
    } else {
      show(message, 'error', 10000)
    }
  },
  success: (message) => {
    show(message, 'success', 3000)
  },
  warning: (message) => {
    show(message, 'warning', 6000)
  }
}

/* Export notification container */
class NotificationContainer extends React.Component {
  componentWillMount () {
    mergeOptions(this.props.options)
  }

  render () {
    return (<div id='notification-wrapper' />)
  }
}

export default NotificationContainer
