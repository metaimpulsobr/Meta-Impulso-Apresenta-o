// Client-side authentication for Google APIs (Slides and Drive)

export interface GoogleUser {
  name?: string;
  email?: string;
}

// Keep access token in memory
let cachedAccessToken: string | null = null;
let googleUser: GoogleUser | null = null;

// Allow dynamic client ID override (from UI or env)
let currentClientId: string = '';

// Try to auto-resolve or default to an empty string to allow manual input in the UI easily.
export function setClientId(id: string) {
  currentClientId = id;
}

export function getCurrentClientId(): string {
  // Try to default to some values if available, otherwise return saved ID
  const isDev = window.location.hostname.includes('dev');
  // Return the client ID
  return currentClientId;
}

export function getCachedToken(): string | null {
  return cachedAccessToken;
}

export function setCachedToken(token: string) {
  cachedAccessToken = token;
}

/**
 * Initiates the Google OAuth 2.0 Implicit Flow via a Popup
 */
export const initiateGoogleOAuthPopup = (clientId: string, scopes: string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!clientId) {
      reject(new Error("Por favor, informe seu Client ID do Google Cloud Console."));
      return;
    }

    const redirectUri = window.location.origin;
    const scopeStr = encodeURIComponent(scopes.join(' '));
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token` +
      `&scope=${scopeStr}` +
      `&state=meta_impulso_auth` +
      `&prompt=consent`;

    // Calculate dimensions of popup
    const width = 500;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      authUrl,
      'google-oauth-login',
      `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes,scrollbars=yes`
    );

    if (!popup) {
      reject(new Error("Pop-up de login bloqueado pelo navegador. Por favor, libere os pop-ups ou abra a aplicação em uma nova guia."));
      return;
    }

    // Set up a listener for message from pop-up redirect
    const messageListener = (event: MessageEvent) => {
      // Basic domain security check
      if (event.origin !== window.location.origin) return;

      if (event.data && event.data.type === 'OAUTH_RESPONSE') {
        const hash = event.data.hash;
        if (hash) {
          const params = new URLSearchParams(hash.replace('#', '?'));
          const accessToken = params.get('access_token');
          const state = params.get('state');

          if (accessToken) {
            cachedAccessToken = accessToken;
            // Fetch basic profile info
            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${accessToken}` }
            })
              .then(res => res.json())
              .then((userInfo: any) => {
                googleUser = {
                  name: userInfo.name,
                  email: userInfo.email
                };
                window.removeEventListener('message', messageListener);
                resolve(accessToken);
              })
              .catch(() => {
                // Return access token anyway
                window.removeEventListener('message', messageListener);
                resolve(accessToken);
              });
          } else {
            reject(new Error("Não foi possível extrair o access token da resposta de autenticação."));
          }
        } else if (event.data.error) {
          reject(new Error(event.data.error));
        }
      }
    };

    window.addEventListener('message', messageListener);

    // Monitoring check if popup is closed manually
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        setTimeout(() => {
          // Give window a chance to clean up
          window.removeEventListener('message', messageListener);
          if (!cachedAccessToken) {
            reject(new Error("Login cancelado pelo usuário."));
          }
        }, 1000);
      }
    }, 1000);
  });
};

/**
 * Handles checking if there's a token inside the URL hash (used in the popup callback page)
 */
export const checkUrlForAuthToken = () => {
  if (window.opener && window.location.hash) {
    // Send hash data to parent window
    window.opener.postMessage({
      type: 'OAUTH_RESPONSE',
      hash: window.location.hash
    }, window.location.origin);
    
    // Close the popup window
    window.close();
  }
};

export const getGoogleUser = (): GoogleUser | null => {
  return googleUser;
};

export const logoutGoogle = () => {
  cachedAccessToken = null;
  googleUser = null;
};
