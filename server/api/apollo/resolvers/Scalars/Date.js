import GraphQLError from 'graphql/error/GraphQLError'
import Kind from 'graphql/language/kinds'

export default {
  __parseValue (value) {
    const date = new Date(value)

    // eslint-disable-next-line no-restricted-globals
    if (Number.isNaN(date.getTime())) {
      throw new TypeError(`Value is not a valid Date: ${value}`)
    }

    return date
    // return new Date(value) // value from the client
  },
  __serialize (value) {
    let v = value

    if (!(v instanceof Date) && typeof v !== 'string' && typeof v !== 'number') {
      throw new TypeError(
        `Value is not an instance of Date, Date string or number: ${v}`,
      )
    }

    if (typeof v === 'string') {
      v = new Date()

      v.setTime(Date.parse(value))
    } else if (typeof v === 'number') {
      v = new Date(v)
    }

    // eslint-disable-next-line no-restricted-globals
    if (Number.isNaN(v.getTime())) {
      throw new TypeError(`Value is not a valid Date: ${v}`)
    }

    return v.toJSON()
    /* if (typeof value.getTime === 'function') {
      return value.getTime() // value sent to the client
    } else {
      const date = new Date(value)
      return date.getTime()
    } */
  },
  __parseLiteral (ast) {
    if (ast.kind !== Kind.STRING && ast.kind !== Kind.INT) {
      throw new GraphQLError(
        `Can only parse strings & integers to dates but got a: ${ast.kind}`
      )
    }

    const result = new Date(ast.kind === Kind.INT ? Number(ast.value) : ast.value)

    // eslint-disable-next-line no-restricted-globals
    if (Number.isNaN(result.getTime())) {
      throw new GraphQLError(`Value is not a valid Date: ${ast.value}`)
    }

    if (ast.kind === Kind.STRING && ast.value !== result.toJSON()) {
      throw new GraphQLError(
        `Value is not a valid Date format (YYYY-MM-DDTHH:MM:SS.SSSZ): ${
          ast.value
        }`,
      )
    }

    return result
    /* switch (ast.kind) {
      case Kind.INT:
      case Kind.FLOAT:
        return new Date(parseFloat(ast.value))
      default:
        return null
    } */
  }
}
