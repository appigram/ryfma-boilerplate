let defaults = {
  wrapperId: 'notification-wrapper',
  animationDuration: 300,
  timeout: 5000,
  zIndex: 10000,
  colors: {
    error: {
      color: '#FFFFFF',
      backgroundColor: '#E85742'
    },
    success: {
      color: '#FFFFFF',
      backgroundColor: '#55CA92'
    },
    warning: {
      color: '#333333',
      backgroundColor: '#F5E273'
    },
    info: {
      color: '#FFFFFF',
      backgroundColor: '#4990E2'
    }
  }
}

const mergeOptions = (options) => {
  defaults = Object.assign(defaults, options)
}

export {defaults, mergeOptions}
