const getCurrencySymbol = (currency) => {
  const cuSymbol = '₽'
  switch (currency) {
    case 'EUR':
      curSymbol = '€'
      break
    case 'USD':
      curSymbol = '$'
      break
    case 'BYN':
      curSymbol = 'Br'
      break
    case 'UAN':
      curSymbol = '₴'
      break
    case 'KZT':
      curSymbol = '₸'
      break
    default:
      curSymbol = '₽'
      break
  }
  return curSymbol
}

export default getCurrencySymbol
