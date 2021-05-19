import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions'

checkNpmVersions({
  '@appigram/graphql-loader': '1.2.x'
}, 'appigram:apollo-accounts')
