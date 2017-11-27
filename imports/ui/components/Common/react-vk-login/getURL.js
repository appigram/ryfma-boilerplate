export default function ({clientId, state, scope}) {
  const current = encodeURIComponent(window.location.href);
  const base = 'https://oauth.vk.com/authorize?response_type=code';
  const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
  const display = mobile ? 'touch' : 'popup';
  const fullScope = scope && scope.length ? `&scope=${encodeURIComponent(scope)}` : '';
  return `${base}&client_id=${clientId}&redirect_uri=${current}&display=${display}&state=${state}${fullScope}`;
}
