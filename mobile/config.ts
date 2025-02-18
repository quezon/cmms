import Constants from 'expo-constants';

export const googleMapsConfig = {
  apiKey: process.env.GOOGLE_KEY
};
export const apiUrl = Constants.expoConfig.extra.API_URL;
export const JWT_SECRET = Constants.expoConfig.extra.JWT_SECRET;
export const IS_LOCALHOST = false;
