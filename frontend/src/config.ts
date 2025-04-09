export const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

export const googleMapsConfig = {
  apiKey:
    process.env.REACT_APP_GOOGLE_KEY ||
    window.__RUNTIME_CONFIG__?.GOOGLE_KEY?.trim()
};
const rawApiUrl =
  process.env.REACT_APP_API_URL || window.__RUNTIME_CONFIG__?.API_URL;
export const apiUrl = rawApiUrl
  ? rawApiUrl.endsWith('/')
    ? rawApiUrl
    : rawApiUrl + '/'
  : 'http://localhost:8080/';
// TODO
// export const zendeskKey =  window.__RUNTIME_CONFIG__?.ZENDESK_KEY ?? '';
export const muiLicense =
  (process.env.REACT_APP_MUI_X_LICENSE ||
    window.__RUNTIME_CONFIG__?.MUI_X_LICENSE?.trim()) ??
  '';

export const zendeskKey = '';

export const googleTrackingId =
  process.env.REACT_APP_GOOGLE_TRACKING_ID ||
  window.__RUNTIME_CONFIG__?.GOOGLE_TRACKING_ID?.trim();
export const isEmailVerificationEnabled: boolean =
  (process.env.REACT_APP_INVITATION_VIA_EMAIL
    ? process.env.REACT_APP_INVITATION_VIA_EMAIL
    : window.__RUNTIME_CONFIG__?.INVITATION_VIA_EMAIL) === 'true';

export const isCloudVersion: boolean =
  (process.env.REACT_APP_CLOUD_VERSION
    ? process.env.REACT_APP_CLOUD_VERSION
    : window.__RUNTIME_CONFIG__?.CLOUD_VERSION) === 'true';
export const IS_LOCALHOST = apiUrl.includes('localhost:');
