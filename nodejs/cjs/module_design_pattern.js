// https://www.telerik.com/blogs/how-module-pattern-works-javascript#:~:text=The%20module%20pattern%20is%20a,being%20accessed%20from%20other%20scopes.

function sum (a, b) {
  return a + b
}

module.exports = {
  sum
}
