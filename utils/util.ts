export const getAvatar = (
  name?: string | null,
  avatar?: string | null,
  userId?: string | null,
) => {
  if (avatar && avatar !== '') {
    if (avatar.startsWith('http')) return avatar
    const config = useRuntimeConfig()
    return `${config.public.apiBase}/api/users/${userId}/picture`
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || 'User',
  )}&background=random&color=fff&size=128`
}

export const formatNumber = (
  value: number,
  locale: string = 'id_ID',
) => {
  return new Intl.NumberFormat(
    locale === 'ar_SA'
      ? 'ar-SA'
      : locale === 'ja_JP'
        ? 'ja-JP'
        : locale === 'en_US'
          ? 'en-US'
          : 'id-ID',
  ).format(value)
}
