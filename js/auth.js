/* ── ARTCANVAS AUTH ──────────────────────────────────── */

const AC_USER_KEY = 'ac_user';

function getUser() {
  try {
    const d = localStorage.getItem(AC_USER_KEY);
    return d ? JSON.parse(d) : null;
  } catch { return null; }
}

function setUser(user) {
  try { localStorage.setItem(AC_USER_KEY, JSON.stringify(user)); } catch {}
}

function signOut() {
  try { localStorage.removeItem(AC_USER_KEY); } catch {}
  try { google?.accounts?.id?.disableAutoSelect(); } catch {}
  location.replace('login.html');
}

/* Auto-login as demo if not authenticated — no wall for first-time visitors */
function requireAuth() {
  let user = getUser();
  if (!user) {
    user = {
      name:       'Guest Artist',
      email:      'guest@artcanvashub.io',
      picture:    null,
      sub:        'demo_guest',
      given_name: 'Guest',
      isDemo:     true,
    };
    setUser(user);
  }
  return user;
}

/* Demo login */
function loginAsDemo() {
  setUser({
    name:       'Guest Artist',
    email:      'guest@artcanvashub.io',
    picture:    null,
    sub:        'demo_guest',
    given_name: 'Guest',
    isDemo:     true,
  });
  location.href = 'home.html';
}

/* Called by Google Identity Services after successful sign-in */
function handleGoogleLogin(response) {
  try {
    const b64 = response.credential.split('.')[1]
      .replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4 ? '='.repeat(4 - b64.length % 4) : '';
    const payload = JSON.parse(atob(b64 + pad));

    setUser({
      name:       payload.name,
      email:      payload.email,
      picture:    payload.picture,
      sub:        payload.sub,
      given_name: payload.given_name || payload.name.split(' ')[0],
    });
    location.href = 'home.html';
  } catch (e) {
    console.error('Google login error:', e);
    const errEl = document.getElementById('loginError');
    if (errEl) { errEl.style.display = 'block'; }
  }
}

window.AC_AUTH = { getUser, setUser, signOut, requireAuth, loginAsDemo };
window.handleGoogleLogin = handleGoogleLogin;
