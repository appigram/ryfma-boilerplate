import Loadable from 'react-loadable'
import Loading from './loading.js'

const dynamicImport = importingComponent => (
  Loadable({
    loader: importingComponent,
    loading: Loading // Loading screen when asynchronously importing component
  })
)

export default dynamicImport
