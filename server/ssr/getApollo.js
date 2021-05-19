const getApollo = (client) => {
  return { apollo: JSON.stringify(client.extract()).replace(/</g, '\\u003c') }
}

export default getApollo
