import React, { useEffect, useState } from 'react'
import { defaults } from './defaults'
import stylesheet from './stylesheet'

/* React Notification Component */
function Toast ({ type, text, timeout, color }) {
  const [containerStyle, setContainerStyle] = useState(stylesheet.styles.container)

  useEffect(() => {
    animateState()
  }, [])

  const { styles } = stylesheet

  const getToastStyle = () => {
    let contentStyle = {}

    /* If type is set, merge toast action styles with base */
    switch (type) {
      case 'success':
      case 'error':
      case 'warning':
      case 'info':
        contentStyle = Object.assign({}, styles.content, defaults.colors[type])
        break
      case 'custom':
        const customStyle = {
          backgroundColor: color.background,
          color: color.text
        }
        contentStyle = Object.assign({}, styles.content, customStyle)
        break
      default:
        contentStyle = Object.assign({}, styles.content)
        break
    }

    return contentStyle
  }

  const animateState = () => {
    // Show
    setTimeout(() => {
      updateStyle(styles.show)
    }, 100) // wait 100ms after the component is called to animate toast.

    // Timeout -1 displays toast as a persistent notification
    if (timeout === -1) {
      return
    }

    // Hide after timeout
    setTimeout(() => {
      updateStyle(styles.hide)
    }, timeout)
  }

  // Updates the style of the container with styles for a state (hide/show).
  // This triggers animations.
  const updateStyle = (stateStyle) => {
    setContainerStyle(Object.assign({}, styles.container, stateStyle))
  }

  return (<div className='toast-notification' style={containerStyle}>
    <span style={getToastStyle()}>
      {text}
    </span>
  </div>)
}

export default Toast
