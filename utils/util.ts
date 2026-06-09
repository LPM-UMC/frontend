export const getAvatar = (
  name?: string | null,
  avatar?: string | null,
) => {
  if (avatar && avatar !== '') {
    if (avatar.startsWith('http')) return avatar
    const config = useRuntimeConfig()
    const baseURL = (config.public.apiBaseUrl as string || 'http://localhost:3001').replace(/\/api\/?$/, '')
    return `${baseURL}${avatar.startsWith('/') ? '' : '/'}${avatar}`
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
