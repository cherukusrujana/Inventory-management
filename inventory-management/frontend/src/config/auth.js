export const authConfig = {
  google: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    redirectUri: process.env.REACT_APP_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback',
    scope: 'profile email'
  }
}; 