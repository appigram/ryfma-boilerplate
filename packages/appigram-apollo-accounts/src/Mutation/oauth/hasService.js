export default function (options, service) {
  if (service === 'facebook') {
    return options.loginWithFacebook
  }

  if (service === 'google') {
    return options.loginWithGoogle
  }

  if (service === 'password') {
    return options.loginWithPassword
  }

  if (service === 'linkedin') {
    return options.loginWithLinkedIn
  }

  if (service === 'twitter') {
    return options.twitter
  }

  if (service === 'vk') {
    return options.loginWithVK
  }

  return false
}
