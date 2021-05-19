import React from 'react'
import { Bundle } from '@appigram/react-code-split-ssr'

// import Public from '../ui/routes/Public'
// import NotAuthenticated from '../ui/routes/NotAuthenticated'
// import authenticated from '../ui/containers/authenticated'

// const HomeLanding = () => <Bundle mod={import('../ui/landings/Home_old/HomeLanding')} />
// const HomeLogged = () => <Bundle mod={import('../ui/landings/Home_old/HomeLogged')} />
const Home = () => <Bundle mod={import('../ui/landings/Home/Explore')} />
const HomeMobile = () => <Bundle mod={import('../ui/landings/Home/ExploreMobile')} />
const Live = () => <Bundle mod={import('../ui/pages/Live')} />
const Login = () => <Bundle mod={import('../ui/pages/Login')} />
const Signup = () => <Bundle mod={import('../ui/pages/Signup')} />
const EmailVerification = () => <Bundle mod={import('../ui/pages/EmailVerification')} />
const RecoverPassword = () => <Bundle mod={import('../ui/pages/RecoverPassword')} />
const NotFound = () => <Bundle mod={import('../ui/pages/NotFound')} />
const ReferralPage = () => <Bundle mod={import('../ui/pages/ReferralPage')} />
const BlogMain = () => <Bundle mod={import('../ui/pages/Blog/index')} />
const BlogList = () => <Bundle mod={import('../ui/pages/Blog/List')} />
const BlogPost = () => <Bundle mod={import('../ui/pages/Blog/Post')} />
const BlogNewPost = () => <Bundle mod={import('../ui/pages/Blog/NewPost')} />
const BlogEditPost = () => <Bundle mod={import('../ui/pages/Blog/EditPost')} />

// Admin dashboard
const AdminDashboard = () => <Bundle mod={import('../ui/components/Admin/Dashboard/index')} />
const AdminSettings = () => <Bundle mod={import('../ui/components/Admin/AdminSettings')} />
const AdminSettingsPayments = () => <Bundle mod={import('../ui/components/Admin/AdminSettingsPayments')} />
const AdminUsers = () => <Bundle mod={import('../ui/components/Admin/Users/index')} />
const AdminTags = () => <Bundle mod={import('../ui/components/Admin/Tags/index')} />
const AdminRhymes = () => <Bundle mod={import('../ui/components/Admin/Rhymes/index')} />
const AdminPromos = () => <Bundle mod={import('../ui/components/Admin/Promotions/index')} />
const AdminPayouts = () => <Bundle mod={import('../ui/components/Admin/Payouts/index')} />
const AdminContests = () => <Bundle mod={import('../ui/components/Admin/Contests/index')} />
const AdminMemberships = () => <Bundle mod={import('../ui/components/Admin/Memberships/index')} />
const AdminSpam = () => <Bundle mod={import('../ui/components/Admin/Spam/index')} />

// Albums
const AlbumPage = () => <Bundle mod={import('../ui/components/Albums/AlbumPage')} />
const EditAlbum = () => <Bundle mod={import('../ui/components/Albums/EditAlbum')} />
const NewAlbum = () => <Bundle mod={import('../ui/components/Albums/NewAlbum')} />

// Ask pages
const AskPosts = () => <Bundle mod={import('../ui/components/Ask/AskPosts')} />
const AskPage = () => <Bundle mod={import('../ui/components/Ask/AskPage')} />
const AskPageLikers = () => <Bundle mod={import('../ui/components/Ask/AskPageLikers')} />
const EditAsk = () => <Bundle mod={import('../ui/components/Ask/EditAsk')} />
const NewAsk = () => <Bundle mod={import('../ui/components/Ask/NewAsk')} />

// Events
// import EventsList from '../ui/components/Events/EventsList'

// Audio
// import AudioList from '../ui/components/Audio/AudioList'

// Video
// import VideoList from '../ui/components/Video/VideoList'

// Books main pages
const AllBooks = () => <Bundle mod={import('../ui/components/Books/AllBooks')} />
const AllGenres = () => <Bundle mod={import('../ui/components/Books/AllGenres')} />
const BooksListWrapper = () => <Bundle mod={import('../ui/components/Books/List/BooksListWrapper')} />
const NewBook = () => <Bundle mod={import('../ui/components/Books/Editor/SettingsNew')} />
const EditBook = () => <Bundle mod={import('../ui/components/Books/Editor/SettingsEdit')} />
const Chapters = () => <Bundle mod={import('../ui/components/Books/Editor/ChaptersWrapper')} />
const NewChapter = () => <Bundle mod={import('../ui/components/Books/Editor/ChapterNew')} />
const EditChapter = () => <Bundle mod={import('../ui/components/Books/Editor/ChapterEdit')} />
const BookSales = () => <Bundle mod={import('../ui/components/Books/Editor/Sales')} />
const BookPrice = () => <Bundle mod={import('../ui/components/Books/Editor/Price')} />

const BookPage = () => <Bundle mod={import('../ui/components/Books/Page/BookPageWrapper')} />
const BookReaderPage = () => <Bundle mod={import('../ui/components/Books/Reader/ReaderPageWrapper')} />

// Users
const UserPage = () => <Bundle mod={import('../ui/components/Users/UserPage')} />
const UserCert = () => <Bundle mod={import('../ui/components/Users/UserCert')} />
const UserAchievements = () => <Bundle mod={import('../ui/components/Users/UserAchievements')} />
const UserAudioPage = () => <Bundle mod={import('../ui/components/Users/Pages/AudioPage')} />
const UserVideoPage = () => <Bundle mod={import('../ui/components/Users/Pages/VideoPage')} />
const UserFollowersPage = () => <Bundle mod={import('../ui/components/Users/Pages/FollowersPage')} />
const UserFollowingPage = () => <Bundle mod={import('../ui/components/Users/Pages/FollowingPage')} />
const UserAlbumsPage = () => <Bundle mod={import('../ui/components/Users/Pages/AlbumsPage')} />
const UserScheduledPostsPage = () => <Bundle mod={import('../ui/components/Users/Pages/ScheduledPostsPage')} />
const UserBooksPage = () => <Bundle mod={import('../ui/components/Users/Pages/BooksPage')} />
const UserBookShelvesPage = () => <Bundle mod={import('../ui/components/Users/Pages/BookShelvesPage')} />
const UserAllPostsPage = () => <Bundle mod={import('../ui/components/Users/Pages/AllPostsPage')} />

// Mobile Users
const UserMobilePage = () => <Bundle mod={import('../ui/components/Users/UserMobilePage')} />

// Me
const Dashboard = () => <Bundle mod={import('../ui/components/Account/Dashboard')} />
const Invites = () => <Bundle mod={import('../ui/components/Account/Invites')} />
const Sales = () => <Bundle mod={import('../ui/components/Account/Sales')} />
const Memberships = () => <Bundle mod={import('../ui/components/Account/Memberships')} />
const MembershipsEdit = () => <Bundle mod={import('../ui/components/Account/MembershipsEdit')} />

const Profile = () => <Bundle mod={import('../ui/components/Account/Profile')} />
const Settings = () => <Bundle mod={import('../ui/components/Account/Settings')} />
const Email = () => <Bundle mod={import('../ui/components/Account/Email')} />
const Security = () => <Bundle mod={import('../ui/components/Account/Security')} />
const Cards = () => <Bundle mod={import('../ui/components/Account/Cards')} />
const Tiers = () => <Bundle mod={import('../ui/components/Account/Tiers')} />
const Payouts = () => <Bundle mod={import('../ui/components/Account/Payouts')} />
const PayoutSuccess = () => <Bundle mod={import('../ui/components/Account/PayoutsResult')} />
const Promote = () => <Bundle mod={import('../ui/components/Account/Promote')} />
const PromoteResult = () => <Bundle mod={import('../ui/components/Account/PromoteResult')} />

const NotificationPageLatest = () => <Bundle mod={import('../ui/components/Notifications/NotificationsPageLatest')} />
const NotificationPageMyComments = () => <Bundle mod={import('../ui/components/Notifications/NotificationsPageMyComments')} />
const NotificationPageAllComments = () => <Bundle mod={import('../ui/components/Notifications/NotificationsPageAllComments')} />

// Ratings
const Reputation = () => <Bundle mod={import('../ui/components/Ratings/Reputation')} />
const Classic = () => <Bundle mod={import('../ui/components/Ratings/Classic')} />
const FairyTails = () => <Bundle mod={import('../ui/components/Ratings/FairyTails')} />

// Posts
const NewPost = () => <Bundle mod={import('../ui/components/Posts/NewPost')} />
const EditPost = () => <Bundle mod={import('../ui/components/Posts/EditPost')} />
const BestPosts = () => <Bundle mod={import('../ui/components/Posts/BestPosts')} />
const HotPosts = () => <Bundle mod={import('../ui/components/Posts/HotPosts')} />
const LatestPosts = () => <Bundle mod={import('../ui/components/Posts/LatestPosts')} />
const EditorsPosts = () => <Bundle mod={import('../ui/components/Posts/EditorsPosts')} />
const PostPage = () => <Bundle mod={import('../ui/components/Posts/PostPage')} />
const PostPageLikers = () => <Bundle mod={import('../ui/components/Posts/PostPageLikers')} />
const PostPageCert = () => <Bundle mod={import('../ui/components/Posts/PostPageCert')} />

// Comments
const CommentPage = () => <Bundle mod={import('../ui/components/Comments/CommentPage')} />

// Tags
const TagsPage = () => <Bundle mod={import('../ui/components/Tags/TagsPage')} />
const TagsFullPage = () => <Bundle mod={import('../ui/components/Tags/TagsFullPage')} />

// Search
const SearchPage = () => <Bundle mod={import('../ui/components/Search/SearchPage')} />

// Unsubscribe
const Unsubscribe = () => <Bundle mod={import('../ui/components/Common/Unsubscribe')} />

// Levitan
// const Levitan = () => <Bundle mod={import('../ui/components/Levitan/App')} />
// Ryfmator
const RyfmatorPage = () => <Bundle mod={import('../ui/components/Ryfmator/RyfmatorPage')} />

// Chat Rooms
const RoomsPage = () => <Bundle mod={import('../ui/components/Rooms/RoomsPage')} />

// Contests
const ContestsList = () => <Bundle mod={import('../ui/components/Contests/Contests/index')} />
const ContestPage = () => <Bundle mod={import('../ui/components/Contests/ContestPage')} />

const ContestUsersStat = () => <Bundle mod={import('../ui/components/Contests/UsersStat')} />
const ContestJuryStat = () => <Bundle mod={import('../ui/components/Contests/JuryStat')} />
const ContestReadersStat = () => <Bundle mod={import('../ui/components/Contests/ReadersStat')} />

// const ContestPosts = () => <Bundle mod={import('../ui/components/Contests/Posts/index')} />
const ContestComments = () => <Bundle mod={import('../ui/components/Contests/Common/CommentsPage')} />
// const ContestCities = () => <Bundle mod={import('../ui/components/Contests/Common/Cities')} />
// const ContestUsers = () => <Bundle mod={import('../ui/components/Contests/Common/Users')} />
// const ContestFAQ = () => <Bundle mod={import('../ui/components/Contests/Common/FAQ')} />

const EditFest = () => <Bundle mod={import('../ui/components/Contests/EditContest')} />
const NewFest = () => <Bundle mod={import('../ui/components/Contests/NewContest')} />

// Duels
const DuelsList = () => <Bundle mod={import('../ui/components/Duels/Duels/index')} />
const DuelPage = () => <Bundle mod={import('../ui/components/Duels/DuelPage')} />
const EditDuel = () => <Bundle mod={import('../ui/components/Duels/EditDuel')} />
const NewDuel = () => <Bundle mod={import('../ui/components/Duels/NewDuel')} />

// Events
const EventsList = () => <Bundle mod={import('../ui/components/Events/Events/index')} />
const EventPage = () => <Bundle mod={import('../ui/components/Events/EventPage')} />
const EventTicketPage = () => <Bundle mod={import('../ui/components/Events/EventTicketPage')} />
const EditEvent = () => <Bundle mod={import('../ui/components/Events/EditEvent')} />
const NewEvent = () => <Bundle mod={import('../ui/components/Events/NewEvent')} />

// Landing pages
const AboutUs = () => <Bundle mod={import('../ui/landings/AboutUs')} />
const FAQ = () => <Bundle mod={import('../ui/landings/FAQ')} />
const PressKit = () => <Bundle mod={import('../ui/landings/PressKit')} />
const Terms = () => <Bundle mod={import('../ui/landings/Terms')} />
const TermsReaders = () => <Bundle mod={import('../ui/landings/TermsReaders')} />
const TermsPremium = () => <Bundle mod={import('../ui/landings/TermsPremium')} />
const TermsTicketsSeller = () => <Bundle mod={import('../ui/landings/TermsTicketsSeller')} />
const TermsTickets = () => <Bundle mod={import('../ui/landings/TermsTickets')} />
const Privacy = () => <Bundle mod={import('../ui/landings/Privacy')} />
const BookCoverDesign = () => <Bundle mod={import('../ui/landings/BookCoverDesign')} />
const Upgrade = () => <Bundle mod={import('../ui/landings/Upgrade')} />
const UpgradeResult = () => <Bundle mod={import('../ui/landings/UpgradeResult')} />
const PaymentSuccess = () => <Bundle mod={import('../ui/landings/PaymentSuccess')} />
const Coins = () => <Bundle mod={import('../ui/landings/Coins')} />

// Promo Landings
const InstaPoems2018 = () => <Bundle mod={import('../ui/landings/InstaPoems2018')} />
const Coronavirus = () => <Bundle mod={import('../ui/landings/Coronavirus')} />
const Sponsors = () => <Bundle mod={import('../ui/landings/Sponsors')} />

/* const Advertise = DynamicImport({
  loader: () => () => import('../ui/landings/Advertise')
}) */

const routes = ({ currUserId, isMobile }) => [
  { exact: true, path: '/', component: isMobile ? HomeMobile : Home },
  { exact: true, path: '/live', component: Live },

  { exact: true, path: '/me/profile', component: Profile },
  { exact: true, path: '/me/account', component: Settings },
  { exact: true, path: '/me/email', component: Email },
  { exact: true, path: '/me/cards', component: Cards },
  { exact: true, path: '/me/payouts', component: Payouts },
  { exact: true, path: '/me/tiers', component: Tiers },
  { exact: true, path: '/me/security', component: Security },
  { exact: true, path: '/me/invites', component: Invites },
  { exact: true, path: '/me/chats/:roomId?', component: RoomsPage },
  { exact: true, path: '/me/sales/:salesType?', component: Sales },
  { exact: true, path: '/me/memberships/:membershipId/edit', component: MembershipsEdit },
  { exact: true, path: '/me/memberships/:membershipType?', component: Memberships },
  { exact: true, path: '/me/promote/:postId?/:postSlug?', component: Promote },
  { exact: true, path: '/me/notifications', component: NotificationPageLatest },
  { exact: true, path: '/me/notifications/mycomments', component: NotificationPageMyComments },
  { exact: true, path: '/me/notifications/allcomments', component: NotificationPageAllComments },
  { exact: true, path: '/me', component: Dashboard },
  { exact: true, path: '/promote/success', component: PromoteResult },

  { exact: true, path: '/authors/:pageNum?', component: Reputation },
  { exact: true, path: '/classic/:pageNum?', component: Classic },
  { exact: true, path: '/fairytails', component: FairyTails },

  { exact: true, path: '/u/:username/cert/:certFest', component: UserCert },
  { exact: true, path: '/u/:username/rewards', component: UserAchievements },
  { exact: true, path: '/u/:username/video', component: UserAudioPage },
  { exact: true, path: '/u/:username/audio', component: UserVideoPage },
  { exact: true, path: '/u/:username/followers', component: UserFollowersPage },
  { exact: true, path: '/u/:username/following', component: UserFollowingPage },
  { exact: true, path: '/u/:username/albums', component: UserAlbumsPage },
  { exact: true, path: '/u/:username/scheduled', component: UserScheduledPostsPage },
  { exact: true, path: '/u/:username/books', component: UserBooksPage },
  { exact: true, path: '/u/:username/bookshelves', component: UserBookShelvesPage },
  { exact: true, path: '(/amp)?/u/:username/all', component: UserAllPostsPage },
  { exact: true, path: '(/amp)?/u/:username', component: isMobile ? UserMobilePage : UserPage },

  { exact: true, path: '/new-post', component: NewPost },
  { exact: true, path: '/p/:postId/:slug?/edit', component: EditPost },
  { exact: true, path: '/p/:postId/:slug/likers/:festId?', component: PostPageLikers },
  { exact: true, path: '/p/:postId/:slug/cert', component: PostPageCert },
  { exact: true, path: '(/amp)?/p/:postId/:slug?', component: PostPage },

  { exact: true, path: '(/amp)?/c/:commentId/:slug?', component: CommentPage },

  { exact: true, path: '/ask/all', component: AskPosts },
  { exact: true, path: '/ask/new-ask', component: NewAsk },
  { exact: true, path: '/ask/:askId/:askSlug?/edit', component: EditAsk },
  { exact: true, path: '/ask/:askId/:askSlug/likers', component: AskPageLikers },
  { exact: true, path: '(/amp)?/ask/:askId/:askSlug?', component: AskPage },

  { exact: true, path: '/new-book', component: NewBook },
  { exact: true, path: '/b/:bookId/:slug?/edit', component: EditBook },
  { exact: true, path: '/b/:bookId/:slug?/edit/price', component: BookPrice },
  { exact: true, path: '/b/:bookId/:slug?/edit/chapters', component: Chapters },
  { exact: true, path: '/b/:bookId/:slug?/edit/sales', component: BookSales },
  { exact: true, path: '(/amp)?/b/:bookId/:slug?', component: BookPage },
  { exact: true, path: '/new-chapter/:chapterNum?', component: NewChapter },
  { exact: true, path: '/ch/:chapterId/:chapterSlug?/:bookId/edit', component: EditChapter },
  { exact: true, path: '/ch/:chapterId/:chapterSlug?', component: BookReaderPage },

  { exact: true, path: '/f/all/:sortBy?', component: ContestsList },
  { exact: true, path: '/f/new-contest', component: NewFest },
  { exact: true, path: '/f/:festSlug/:festId?/edit', component: EditFest },
  // { exact: true, path: '/f/:festSlug/:festId/posts', component: ContestPosts },
  { exact: true, path: '/f/:festSlug/:festId/users/:pageNum?', component: ContestUsersStat },
  { exact: true, path: '/f/:festSlug/:festId/stat_jury', component: ContestJuryStat },
  { exact: true, path: '/f/:festSlug/:festId/stat_readers', component: ContestReadersStat },
  { exact: true, path: '/f/:festSlug/:festId?/comments', component: ContestComments },
  { exact: true, path: '/f/:festSlug/:festId?/:festPage?', component: ContestPage },
  { exact: true, path: '/f/:festSlug/:festId?/level/:levelNum?', component: ContestPage },
  { exact: true, path: '(/amp)?/f/:festSlug/:festId?', component: ContestPage },

  { exact: true, path: '/d/all/:sortBy?', component: DuelsList },
  { exact: true, path: '/d/new-contest', component: NewDuel },
  { exact: true, path: '/d/:duelId/:duelSlug?/edit', component: EditDuel },
  { exact: true, path: '(/amp)?/d/:duelId/:duelSlug?', component: DuelPage },

  { exact: true, path: '/e/all', component: EventsList },
  { exact: true, path: '/e/new-event', component: NewEvent },
  { exact: true, path: '/e/:eventSlug/:eventId?/edit/:activeTab?', component: EditEvent },
  { exact: true, path: '(/amp)?/e/:eventSlug', component: EventPage },
  { exact: true, path: '/e/ticket/:ticketId', component: EventTicketPage },

  { exact: true, path: '/new-album', component: NewAlbum },
  { exact: true, path: '/album/:albumId/edit', component: EditAlbum },
  { exact: true, path: '(/amp)?/album/:albumId/:slug?', component: AlbumPage },

  { exact: true, path: '/r/:referralId', component: ReferralPage },

  { exact: true, path: '/best', component: BestPosts },
  { exact: true, path: '/hot', component: HotPosts },
  { exact: true, path: '/latest', component: LatestPosts },
  { exact: true, path: '/picks', component: EditorsPosts },

  { exact: true, path: '/books/all', component: AllBooks },
  { exact: true, path: '/books/genres', component: AllGenres },
  { exact: true, path: '/books/genres/:bookGenre/:pageNum?', component: BooksListWrapper },
  { exact: true, path: '/books/:bookSubPage/:pageNum?', component: BooksListWrapper },
  /* { exact: true, path: '/books/popular/:pageNum?', component: BooksListWrapper },
  { exact: true, path: '/books/trending/:pageNum?', component: BooksListWrapper },
  { exact: true, path: '/books/updated/:pageNum?', component: BooksListWrapper },
  { exact: true, path: '/books/picks/:pageNum?', component: BooksListWrapper },
  { exact: true, path: '/books/free/:pageNum?', component: BooksListWrapper },
  { exact: true, path: '/books/paid/:pageNum?', component: BooksListWrapper }, */

  { exact: true, path: '(/amp)?/tags/:tagId/:tagName', component: TagsPage },
  { exact: true, path: '/tagsmap/:pageNum?', component: TagsFullPage },

  { exact: true, path: '/search/:searchType?/:keyword?', component: SearchPage },
  { exact: true, path: '/search/:searchType?/:keyword?', component: SearchPage },

  // { exact: true, path: '/levitan', component: Levitan },

  { exact: true, path: '(/amp)?/rhyme/:word?', component: RyfmatorPage },

  { exact: true, path: '/login', component: Login },
  { exact: true, path: '/register/:refToken?', component: Signup },

  { exact: true, path: '/email-verification/:token?', component: EmailVerification },
  { exact: true, path: '/recover-password', component: RecoverPassword },
  { exact: true, path: '/reset-password/:token?', component: RecoverPassword },
  { exact: true, path: '/unsubscribe/:userId', component: Unsubscribe },

  { exact: true, path: '/radm', component: AdminDashboard },
  { exact: true, path: '/radm/settings', component: AdminSettings },
  { exact: true, path: '/radm/settings/payments', component: AdminSettingsPayments },
  { exact: true, path: '/radm/users/:pageNum?', component: AdminUsers },
  { exact: true, path: '/radm/rhymes/:pageNum?', component: AdminRhymes },
  { exact: true, path: '/radm/tags/:pageNum?', component: AdminTags },
  { exact: true, path: '/radm/promos/:pageNum?', component: AdminPromos },
  { exact: true, path: '/radm/payouts/:pageNum?', component: AdminPayouts },
  { exact: true, path: '/radm/contests/:pageNum?', component: AdminContests },
  { exact: true, path: '/radm/memberships/:pageNum?', component: AdminMemberships },
  { exact: true, path: '/radm/spam/:pageNum?', component: AdminSpam },

  { exact: true, path: '/aboutus', component: AboutUs },
  { exact: true, path: '/faq', component: FAQ },
  { exact: true, path: '/press', component: PressKit },
  { exact: true, path: '/terms', component: Terms },
  { exact: true, path: '/terms-readers', component: TermsReaders },
  { exact: true, path: '/terms-premium', component: TermsPremium },
  { exact: true, path: '/terms-tickets-seller', component: TermsTicketsSeller },
  { exact: true, path: '/terms-tickets', component: TermsTickets },
  { exact: true, path: '/privacy', component: Privacy },
  { exact: true, path: '/cover-design', component: BookCoverDesign },
  { exact: true, path: '/instapoems_2018', component: InstaPoems2018 },
  { exact: true, path: '/coronavirus', component: Coronavirus },
  { exact: true, path: '/sponsors', component: Sponsors },
  /* { exact: true, path: '/explore', component: Explore }, */

  { exact: true, path: '/payment/success', component: PaymentSuccess },
  { exact: true, path: '/me/payouts/success', component: PayoutSuccess },
  { exact: true, path: '/upgrade/success', component: UpgradeResult },
  { exact: true, path: '/upgrade', component: Upgrade },
  { exact: true, path: '/coins', component: Coins },

  { exact: true, path: '/blog', component: BlogMain },
  { exact: true, path: '/blog/new-post', component: BlogNewPost },
  { exact: true, path: '/blog/:blogId/:blogSlug?/edit', component: BlogEditPost },
  { exact: true, path: '/blog/category/:tagId/:tagSlug?', component: BlogList },
  { exact: true, path: '(/amp)?/blog/:blogId/:blogSlug?', component: BlogPost }
]

const redirects = []

const notFoundComp = NotFound

export { routes, redirects, notFoundComp }
