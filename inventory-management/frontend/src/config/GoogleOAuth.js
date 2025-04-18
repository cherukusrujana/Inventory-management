export const googleConfig = {
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  redirectUri: process.env.REACT_APP_GOOGLE_REDIRECT_URI,
  scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  responseType: 'code',
  accessType: 'offline',
  prompt: 'consent'
}; 