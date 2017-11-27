import { followUser, unFollowUser, sendInvitesEmail, changeLevitanCount, sendVerificationLink } from './user'
import { saveProfile, checkIfUsernameExists, saveSettings, changeUserAvatar } from './me'

export default {
  followUser,
  unFollowUser,
  sendInvitesEmail,
  saveProfile,
  changeUserAvatar,
  checkIfUsernameExists,
  saveSettings,
  changeLevitanCount,
  sendVerificationLink
}
