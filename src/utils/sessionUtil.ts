const REDIRECT_KEY = "redirectAfterLogin";

export const saveCurrentLocation = () => {
  const currentPath = window.location.pathname + window.location.search;
  localStorage.setItem(REDIRECT_KEY, currentPath);
};

export const getRedirectUrl = (): string | null => {
  return localStorage.getItem(REDIRECT_KEY);
};

export const clearRedirectUrl = () => {
  localStorage.removeItem(REDIRECT_KEY);
};

export const restoreLocation = (navigate: (path: string) => void) => {
  const redirectUrl = getRedirectUrl();
  if (redirectUrl && redirectUrl !== "/login") {
    clearRedirectUrl();
    navigate(redirectUrl);
  }
};
