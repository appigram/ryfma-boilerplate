// Prepare init data
const getHelmet = (helmetContext) => {
  const { helmet } = helmetContext
  const meta = helmet.meta.toString()
  const title = helmet.title.toString()
  const link = helmet.link.toString()
  const script = helmet.script.toString()

  const htmlAttrs = helmet.htmlAttributes.toComponent()
  return { helmet: { meta, title, link, script, htmlAttrs } }
}

export default getHelmet
