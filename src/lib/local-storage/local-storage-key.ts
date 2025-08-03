export const LocalStorageKeys = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_INFO: "userInfo",
  LANGUAGE: "language",
  THEME: "theme",
  ONBOARDING_DONE: "onboardingDone"
  // ... thêm key khác nếu cần
} as const;

export type LocalStorageKey =
  (typeof LocalStorageKeys)[keyof typeof LocalStorageKeys];
