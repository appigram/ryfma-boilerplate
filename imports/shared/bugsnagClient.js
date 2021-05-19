import React from 'react'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'

Bugsnag.start({
  apiKey: '',
  plugins: [new BugsnagPluginReact()]
})

export const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)

export default Bugsnag
