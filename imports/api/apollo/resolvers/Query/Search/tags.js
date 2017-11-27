import Tags from '../../../../collections/Tags'

const searchTags = (root, args, context) => {
  const options = {}
  let fields = {}

  options.limit = 3 // Set user limit to 3
  options.sort = {
    count: -1 // Sorted by likeCount descending
  }

  if (args.keyword) {
    const regex = new RegExp(args.keyword, 'i')
    fields = {
      $or: [
        { name: regex }
      ]
    }
  }

  return Tags.find(fields, options).fetch()
}

export { searchTags }
