export const SUPPORTED_LANG = ["id", "en", "ar", "ja"] as const;
export type lang = typeof SUPPORTED_LANG[number];
