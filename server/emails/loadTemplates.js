

import REmail from './REmail'
// import fs from 'fs'

REmail.addTemplates({
  wrapper: Assets.getText('emails/common/wrapper.handlebars'),
  newYear: Assets.getText('emails/celebrate/newYear.handlebars'),

  newBlogPost: Assets.getText('emails/blog/newBlogPost.handlebars'),

  newPosts: Assets.getText('emails/posts/newPosts.handlebars'),

  newComments: Assets.getText('emails/comments/newComments.handlebars'),
  newCommentsInTalks: Assets.getText('emails/comments/newCommentsInTalks.handlebars'),

  newMessages: Assets.getText('emails/messages/newMessages.handlebars'),
  unreadMessages: Assets.getText('emails/messages/unreadMessages.handlebars'),

  newContest: Assets.getText('emails/contests/newContest.handlebars'),
  contestFinishing: Assets.getText('emails/contests/contestFinishing.handlebars'),
  contestDone: Assets.getText('emails/contests/contestDone.handlebars'),
  duelInvite: Assets.getText('emails/contests/duelInvite.handlebars'),

  newTickets: Assets.getText('emails/tickets/newTickets.handlebars'),
  reminderTickets: Assets.getText('emails/tickets/reminderTickets.handlebars'),

  newEvents: Assets.getText('emails/events/newEvents.handlebars'),
  reminderEvents: Assets.getText('emails/events/reminderEvents.handlebars'),

  newGift: Assets.getText('emails/common/newGift.handlebars'),

  newFollowers: Assets.getText('emails/users/newFollowers.handlebars'),
  newSponsor: Assets.getText('emails/users/newSponsor.handlebars'),
  lostSponsorship: Assets.getText('emails/users/lostSponsorship.handlebars'),
  pausedSponsorship: Assets.getText('emails/users/pausedSponsorship.handlebars'),
  resumeSponsorship: Assets.getText('emails/users/resumeSponsorship.handlebars'),
  welcome: Assets.getText('emails/users/welcome.handlebars'),
  invite: Assets.getText('emails/users/invite.handlebars'),
  promoteYourself: Assets.getText('emails/users/promoteYourself.handlebars'),

  latestNews: Assets.getText('emails/newsletter/latestNews.handlebars'),

  userStats: Assets.getText('emails/newsletter/userStats.handlebars'),

  auth_enroll: Assets.getText('emails/auth/enroll.handlebars'),
  auth_reset: Assets.getText('emails/auth/reset.handlebars'),
  auth_verify: Assets.getText('emails/auth/verify.handlebars')
})
