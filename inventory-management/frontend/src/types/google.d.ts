interface Window {
  google: {
    accounts: {
      oauth2: {
        initTokenClient: (config: {
          client_id: string;
          scope: string;
          callback: (tokenResponse: { access_token: string }) => void;
          error_callback: (error: any) => void;
        }) => {
          requestAccessToken: () => void;
        };
      };
    };
  };
} 