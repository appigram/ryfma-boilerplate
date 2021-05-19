const getI18N = async (i18nServer, locale) => {
  const usedNamesapes = i18nServer.reportNamespaces ? i18nServer.reportNamespaces.getUsedNamespaces() : ['common', 'user', 'post']
  // console.log('usedNamesapes: ', usedNamesapes)
  /* const translation = {
    [locale]: i18nServer.services.resourceStore.data[locale]
  } */

  // console.log('i18nServer.services: ', i18nServer.services)
  // i18nInstance is a i18next instance with all languages and all namespaces preloaded
  // console.log('locale:', localeInit)
  const initialI18nStore = { [locale]: {} }
  Array.from(usedNamesapes).forEach(ns => {
    try {
      initialI18nStore[locale][ns] = i18nServer.services.resourceStore.data[locale][ns]
    } catch (e) {
      initialI18nStore[locale][ns] = {}
    }
  })
  const i18Store = JSON.stringify(initialI18nStore)

  return { i18n: i18Store, locale }
}

export default getI18N
