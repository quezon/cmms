import Constants from 'expo-constants';

export const googleMapsConfig = {
  apiKey: process.env.GOOGLE_KEY
};
const rawApiUrl = Constants.expoConfig.extra.API_URL;
export const IS_LOCALHOST = false;
export const apiUrl = rawApiUrl.endsWith('/') ? rawApiUrl : rawApiUrl + '/';
