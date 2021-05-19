const CBRDataURL = '/data/cbr_currencies.json'

const convertPriceTo = async (price, fromCurrency, toCurrency = 'RUB') => {
  if (fromCurrency) {
    const response = await fetch(CBRDataURL)
    if (response.ok) {
      let CBRData = await response.json()
      if (CBRData && CBRData.Valute[fromCurrency]) {
        const newPrice = price * CBRData.Valute[fromCurrency].Value
        const finalPrice = Math.round(newPrice * 1.01)
        return finalPrice
      }
    }
  }
  return null
}

export default convertPriceTo
