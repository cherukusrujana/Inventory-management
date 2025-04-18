export const googleConfig = {
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.REACT_APP_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback',
  scope: 'email profile'
}; 