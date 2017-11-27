import { Bundle } from 'react-code-split-ssr'
import React from 'react'

// import Public from '../ui/routes/Public'
// import NotAuthenticated from '../ui/routes/NotAuthenticated'
// import authenticated from '../ui/containers/authenticated'

const Home = () => <Bundle mod={import('../ui/pages/Home')} />
const Login = () => <Bundle mod={import('../ui/pages/Login')} />
const Signup = () => <Bundle mod={import('../ui/pages/Signup')} />
const EmailVerification = () => <Bundle mod={import('../ui/pages/EmailVerification')} />
const RecoverPassword = () => <Bundle mod={import('../ui/pages/RecoverPassword')} />
const NotFound = () => <Bundle mod={import('../ui/pages/NotFound')} />
const ReferralPage = () => <Bundle mod={import('../ui/pages/ReferralPage')} />

// Admin dashboard
const AdminDashboard = () => <Bundle mod={import('../ui/components/Admin/AdminDashboard')} />

// Users
const UserPage = () => <Bundle mod={import('../ui/components/Users/UserPage')} />

// Me
const Dashboard = () => <Bundle mod={import('../ui/components/Account/Dashboard')} />
const Profile = () => <Bundle mod={import('../ui/components/Account/Profile')} />
const Settings = () => <Bundle mod={import('../ui/components/Account/Settings')} />
const Invites = () => <Bundle mod={import('../ui/components/Account/Invites')} />

// Posts
const NewPost = () => <Bundle mod={import('../ui/components/Posts/NewPost')} />
const EditPost = () => <Bundle mod={import('../ui/components/Posts/EditPost')} />
const BestPosts = () => <Bundle mod={import('../ui/components/Posts/BestPosts')} />
const PostPage = () => <Bundle mod={import('../ui/components/Posts/PostPage')} />

// Tags
const TagsPage = () => <Bundle mod={import('../ui/components/Tags/TagsPage')} />

// Search
const SearchPage = () => <Bundle mod={import('../ui/components/Search/SearchPage')} />

const routes = [
  { exact: true, path: '/', component: Home },

  { exact: true, path: '/me', component: Dashboard },
  { exact: true, path: '/me/profile', component: Profile },
  { exact: true, path: '/me/settings', component: Settings },
  { exact: true, path: '/me/invites', component: Invites },

  { exact: false, path: '/u/:username', component: UserPage },
  { exact: true, path: '/u/:username/saved', component: UserPage },
  { exact: true, path: '/u/:username/followers', component: UserPage },
  { exact: true, path: '/u/:username/following', component: UserPage },

  { exact: true, path: '/new-post', component: NewPost },
  { exact: true, path: '/p/:postId/:slug?/edit', component: EditPost },
  { exact: false, path: '/p/:postId/:slug?', component: PostPage },

  { exact: true, path: '/r/:referralId', component: ReferralPage },

  { exact: true, path: '/best', component: BestPosts },

  { exact: false, path: '/tags/:tagId/:tagName', component: TagsPage },

  { exact: false, path: '/search/:searchType?/:keyword?', component: SearchPage },

  { exact: true, path: '/login', component: Login },
  { exact: false, path: '/register/:refToken?', component: Signup },

  { exact: true, path: '/email-verification/:token?', component: EmailVerification },
  { exact: true, path: '/recover-password', component: RecoverPassword },
  { exact: false, path: '/reset-password/:token?', component: RecoverPassword },

  { exact: true, path: '/radm/users', component: AdminDashboard }
]

const redirects = []

const notFoundComp = NotFound

export { routes, redirects, notFoundComp }
