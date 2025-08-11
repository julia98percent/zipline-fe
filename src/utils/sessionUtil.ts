export const saveCurrentLocation = () => {
  const currentPath = window.location.pathname + window.location.search;
  localStorage.setItem("redirectAfterLogin", currentPath);
};

export const getRedirectUrl = (): string | null => {
  return localStorage.getItem("redirectAfterLogin");
};

export const clearRedirectUrl = () => {
  localStorage.removeItem("redirectAfterLogin");
};

export const restoreLocation = (navigate: (path: string) => void) => {
  const redirectUrl = getRedirectUrl();
  if (redirectUrl && redirectUrl !== "/login") {
    clearRedirectUrl();
    navigate(redirectUrl);
  }
};
