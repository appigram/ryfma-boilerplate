

import REmail from './REmail'

REmail.addEmails({
  test: {
    template: 'test',
    path: '/email/test',
    data() {
      return { date: new Date() }
    },
    subject() {
      return 'This is a test'
    }
  }

})

/*
Auth
*/
REmail.addEmails({
  auth_reset: {
    template: 'auth_reset',
    path: '/email/reset'
  },
  auth_verify: {
    template: 'auth_verify',
    path: '/email/verify'
  },
  auth_enroll: {
    template: 'auth_enroll',
    path: '/email/enroll'
  }
})

/*
Blog and newsletter
*/
REmail.addEmails({
  newBlogPost: {
    template: 'newBlogPost',
    path: '/email/new-blog-post/:_id?',
    subject(data) {
      return '⭐️ Новый пост в блоге Ryfma'
    }
  }
})

/*
Users
*/

REmail.addEmails({
  newFollowers: {
    template: 'newFollowers',
    path: '/email/new-follower/:_id?',
    subject(data) {
      return '🔥' + data.currUser.profile.name + ' только что подписался на Вас!'
    }
  },
  newSponsor: {
    template: 'newSponsor',
    path: '/email/new-sponsor/:_id?',
    subject(data) {
      return '✅У Вас новый спонсор на сумму ' + data.membership.price + data.membership.currency + '!'
    }
  },
  lostSponsorship: {
    template: 'lostSponsorship',
    path: '/email/lost-sponsorship/:_id?',
    subject(data) {
      return '💔Вы хотели оформить подписку на автора...'
    }
  },
  pausedSponsorship: {
    template: 'pausedSponsorship',
    path: '/email/paused-sponsorship/:_id?',
    subject(data) {
      return '💔Не удалось собершить платеж для поддержки автора...'
    }
  },
  resumeSponsorship: {
    template: 'resumeSponsorship',
    path: '/email/resume-sponsorship/:_id?',
    subject(data) {
      return '⭐️Возобновите подписку на автора!'
    }
  },
  invite: {
    template: 'invite',
    path: '/email/invite',
    subject(data) {
      return `😎Приглашение на Ryfma`
    }
  },
  welcome: {
    template: 'welcome',
    path: '/email/welcome',
    subject(data) {
      return '🎉Добро пожаловать на Ryfma!'
    }
  },
  promoteYourself: {
    template: 'promoteYourself',
    path: '/email/promoteYourself',
    subject(data) {
      return '🔥Продвигай свое творчество на Ryfma!'
    }
  }
})

/*
Posts
*/
REmail.addEmails({
  newPosts: {
    template: 'newPosts',
    path: '/email/new-posts/:_id?',
    subject(data) {
      return '🔥' + data.user.profile.name + ' опубликовал(а) "' + data.post.title + '" на Ryfma!'
    }
  }
})

/*
Comments
*/
REmail.addEmails({
  newComments: {
    template: 'newComments',
    path: '/email/new-comments/:_id?',
    subject(data) {
      return '🔥У Вас новые комментарии!'
    }
  },
  newCommentsInTalks: {
    template: 'newCommentsInTalks',
    path: '/email/new-comments-in-talks/:_id?',
    subject(data) {
      return '🔥Новые комментарии в обсуждении!'
    }
  }
})

/*
Contests
*/
REmail.addEmails({
  newContest: {
    template: 'newContest',
    path: '/email/new-contest/:_id?',
    subject(data) {
      return '🏆 Новый конкурс "' + data.contest.title + '" на Ryfma!'
    }
  },
  contestFinishing: {
    template: 'contestFinishing',
    path: '/email/contest-finishing/:_id?',
    subject(data) {
      return '⏳ ' + data.emailPreview
    }
  },
  contestDone: {
    template: 'contestDone',
    path: '/email/contest-done/:_id?',
    subject(data) {
      return '🏁 Конкурс "' + data.contest.title + '" завершён!'
    }
  },
  duelInvite: {
    template: 'duelInvite',
    path: '/email/duel-invite/:_id?',
    subject(data) {
      return '🎤 Вызов на дуэль "' + data.duel.title + '"'
    }
  }
})

/*
  Messages
*/
REmail.addEmails({
  newMessages: {
    template: 'newMessages',
    path: '/email/new-messages/:_id?',
    subject(data) {
      return '🔥У Вас новое сообщение!'
    }
  },
  unreadMessages: {
    template: 'unreadMessages',
    path: '/email/unread-messages/:_id?',
    subject(data) {
      return '⏳У Вас есть непрочитанные сообщения!'
    }
  }
})

/*
  Tickets
*/
REmail.addEmails({
  newTickets: {
    template: 'newTickets',
    path: '/email/new-ticket/:_id?',
    subject(data) {
      return '🎤Электронные билеты на мероприятие!'
    }
  },
  reminderTickets: {
    template: 'reminderTickets',
    path: '/email/reminder-ticket/:_id?',
    subject(data) {
      return '🎤Напоминание о ближайшем событии!'
    }
  }
})

/*
  Events
*/
REmail.addEmails({
  newEvents: {
    template: 'newEvents',
    path: '/email/new-event/:_id?',
    subject(data) {
      return '🎤 Интересные мероприятия твоего города!'
    }
  },
  reminderEvents: {
    template: 'reminderEvents',
    path: '/email/reminder-event/:_id?',
    subject(data) {
      return '🎤Напоминание о ближайшем событии!'
    }
  }
})

/*
  Gifts
*/
REmail.addEmails({
  newGift: {
    template: 'newGift',
    path: '/email/new-gift/:_id?',
    subject(data) {
      return '🎁Вы получили подарок!'
    }
  }
})

/*
  Newsletter
*/
REmail.addEmails({
  latestNews: {
    template: 'latestNews',
    path: '/email/latestNews',
    data() {
      return { date: new Date() }
    },
    subject(data) {
      return '🦠"Возврату не подлежит". 120 топовых поэтов в одном сборнике!'
    }
  },
  newYear: {
    template: 'newYear',
    path: '/email/newYear',
    data() {
      return { date: new Date() }
    },
    subject(data) {
      return '🎅🎄🎁С наступающим 2020 годом!'
    }
  },
  userStats: {
    template: 'userStats',
    path: '/email/user-stats/:_id?',
    subject(data) {
      return '🎄🎁 Ваши результаты на Ryfma в 2018 году!'
    }
  }
})
