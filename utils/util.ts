export const getAvatar = (name?: string | null, avatar?: string | null) => {
  if (avatar && avatar !== '') return avatar

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff&size=128`
}
