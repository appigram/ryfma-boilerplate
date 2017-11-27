import Tags from '../../../../collections/Tags'

export default function (root, params, context) {
  const options = {}
  options.limit = 15 // Set post limit to 10
  options.sort = {
    createdAt: -1 // Sorted by createdAt descending
  }

  // Query optimization
  options.fields = {
    name: 1,
    slug: 1
  }

  return Tags.find({}, options).fetch()
}
