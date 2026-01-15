export function deleteAuthCookie() {
  document.cookie =
    "token=; path=/; max-age=0; SameSite=Strict";
}
