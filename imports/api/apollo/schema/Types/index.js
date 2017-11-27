import User from './User.graphql';
import Tag from './Tag.graphql';
import Comment from './Comment.graphql';
import Post from './Post.graphql';
import Follower from './Follower.graphql';
import Notification from './Notification.graphql';
import Payment from './Payment.graphql';

// Paginated Types
import PaginatedPost from './PaginatedPost.graphql';
import PaginatedUser from './PaginatedUser.graphql';

export default [
  User,
  Tag,
  Comment,
  Post,
  Follower,
  Notification,
  PaginatedPost,
  PaginatedUser,
  Payment,
];
