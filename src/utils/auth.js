// Login state helpers.
//
// The backend sets two things on login:
//   - a short-lived (15 min) access token, returned in the JSON body and saved here in localStorage
//   - a 7-day httpOnly refresh cookie, which JavaScript can't read
// API calls that need the user (profile, "my reports") rely on the cookie, because the backend
// accepts it on its own. The stored token is only used as a cheap "has this browser signed in?" flag,
// so the UI can decide what to show without a network call.
export const TOKEN_KEY = 'voltfix_token';

export function hasSession() {
  try {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  } catch {
    return false;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage unavailable, nothing to clear
  }
}
