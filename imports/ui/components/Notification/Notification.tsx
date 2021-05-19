import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import Toast from './Toast'
import {
  defaults,
  // mergeOptions
} from './defaults'

const renderToast = (text = '', type = '', timeout = 0, color = {}) => {
  const target = document.getElementById(defaults.wrapperId)
  render(<Toast text={text} timeout={timeout} type={type} color={color} />, target)
}

const hide = () => {
  const target = document.getElementById(defaults.wrapperId)
  if (target) {
    unmountComponentAtNode(target)
  }
}

const show = (text = '', type = '', timeout = 0, color = {}) => {
  const notifWrapper = document.getElementById(defaults.wrapperId)
  if (notifWrapper) {
    if (!notifWrapper.hasChildNodes()) {
      // Use default timeout if not set.
      const renderTimeout = timeout || defaults.timeout

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
  }

  return false
}

export const Notification = {
  error: (message) => {
    if (message) {
      if (message.graphQLErrors) {
        if (message.graphQLErrors[0]) {
          show(message.graphQLErrors[0].message, 'error', 10000)
        } else {
          if (message.message) {
            show(message.message, 'error', 10000)
          } else {
            show(message, 'error', 10000)
          }
        }
      } else if (message.message) {
        show(message.message, 'error', 10000)
      } else {
        show(message, 'error', 10000)
      }
    } else {
      show('An unknown error occured', 'error', 5000)
    }
  },
  success: (message: string) => {
    show(message, 'success', 3000)
  },
  warning: (message: string) => {
    show(message, 'warning', 6000)
  }
}

/* Export notification container */
function NotificationContainer () {
  /* useEffect(() => {
    mergeOptions(options)
  }, []) */

  return (<div id='notification-wrapper' />)
}

export default NotificationContainer
