export const googleCalendarConfig = {
    clientId: '262156359632-7bhrgb1jq2p9hefo8dip7253cca90qe6.apps.googleusercontent.com',
    clientSecret: '262156359632-7bhrgb1jq2p9hefo8dip7253cca90qe6.apps.googleusercontent.com', // Cole o Client Secret aqui
    redirectUri: 'http://localhost:3000/auth/google/callback',
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ]
  };