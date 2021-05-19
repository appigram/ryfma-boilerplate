const goToBack = (fallbackUrl) => {
  fallbackUrl = fallbackUrl || '/'
  const prevPage = window.location.href

  window.history.go(-1)

  setTimeout(() => {
    if (window.location.href === prevPage) {
      window.location.href = fallbackUrl
    }
  }, 500)
  // window.history.back()
}

export { goToBack }
