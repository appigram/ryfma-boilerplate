import Comments from '/server/api/collections/Comments'

const getComments = (data) => {
  console.log('Comments generation started!')
  const result = data || []
  return new Promise((resolve, reject) => {
    const changefreq = 'monthly'
    const url = config.HOST + '/c/'
    const options = {}
    options.fields = {
      _id: 1,
      slug: 1
    }
    const comments = Comments.find({}, options)
    comments.forEach(item => {
      try {
        result.push({
          url: url + item._id + '/' + encodeURIComponent(item.slug),
          changefreq: changefreq
          // ampLink: url + item._id + '/' + item.name
        })
      } catch (err) {
        console.log(err)
      }
    })
    resolve(result)
  })
}

export default getComments
