Array.includes = function () {
  const [first, ...rest] = arguments
  return Array.prototype.includes.apply(first, rest)
}
