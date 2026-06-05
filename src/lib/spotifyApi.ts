import axios from 'axios';

function generateRandomString(length: number) {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

function base64encode(input: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const authUrl = new URL('https://accounts.spotify.com/authorize');
const scope = 'user-read-private user-read-email';

export async function authenticate() {
  const codeVerifier = generateRandomString(128);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  window.localStorage.setItem('code_verifier', codeVerifier);

  const params = {
    response_type: 'code',
    client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_REDIRECT_TARGET,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
}

export async function getToken(code: string) {
  const codeVerifier = window.localStorage.getItem('code_verifier');

  const res = await axios.post(
    'https://accounts.spotify.com/api/token',
    {
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_REDIRECT_TARGET,
      grant_type: 'authorization_code',
      code,
      code_verifier: codeVerifier,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  window.localStorage.setItem('access_token', res.data.access_token);
  window.localStorage.setItem('refresh_token', res.data.refresh_token);
}

export function isAuthenticated() {
  const token = window.localStorage.getItem('access_token');
  return !token ? false : true;
}

// const spotifyApi = axios.create({ baseURL: 'https://api.spotify.com/v1' });

// const token = '';
// spotifyApi.defaults.headers['Authorization'] = `Bearer ${token}`;
