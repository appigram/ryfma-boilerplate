import { Picker } from 'meteor/meteorhacks:picker'
import REmail from './REmail.js'

Meteor.startup(function () {
  Object.keys(REmail.emails).map((key, index) => {
    // template live preview routes
    const email = REmail.emails[key]
    Picker.route(email.path, async (params, req, res) => {
      console.log('email: ', email)
      let html
      // if email has a custom way of generating test HTML, use it
      if (typeof email.getTestHTML !== 'undefined') {
        html = email.getTestHTML.bind(email)(params)
      } else {
        // const locale = params.query.locale || 'ru'

        // else get test object (sample post, comment, user, etc.)
        const testVariables = (typeof email.testVariables === 'function' ? email.testVariables() : email.testVariables) || {}
        // merge test variables with params from URL
        const variables = {
          ...testVariables,
          ...params,
          emailPreview: 'Test',
          body: 'Test body'
        }
        console.log('variables: ', variables)
        // const result = email.query ? await runQuery(email.query, variables, { locale }) : {data: {}}
        const result = { data: variables }

        // if email has a data() function, merge it with results of query
        const emailTestData = email.data ? { ...result.data, ...email.data(variables) } : result.data
        const subject = typeof email.subject === 'function' ? email.subject(emailTestData) : email.subject
        // emailTestData.__ = Strings[locale]

        // const template = REmail.getTemplate(email.template)

        const htmlContent = REmail.getTemplate('wrapper')(emailTestData)
        console.log('htmlContent: ', htmlContent)

        // then apply email template to properties, and wrap it with buildTemplate
        html = REmail.buildTemplate(htmlContent, emailTestData)

        // remove Strings object to avoid echoing it out
        // delete emailTestData.__

        html += `
          <h4 style="margin: 20px;"><code>Subject: ${subject}</code></h4>
          <div style="border: 1px solid #999; padding: 10px 20px; margin: 20px;">
            <pre><code>${JSON.stringify(emailTestData, null, 2)}</code></pre>
          </div>
        `
      }

      // return html
      res.end(html)
    })

    // raw template
    Picker.route('/email/template/:template', (params, req, res) => {
      console.log('params: ', params)
      res.end(REmail.templates[params.template])
    })
  })
})
