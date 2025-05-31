import { apiUrl, customLogoPaths } from '../config';
import { useSelector } from '../store';

const DEFAULT_WHITE_LOGO = '/static/images/logo/logo-white.png';
const DEFAULT_DARK_LOGO = '/static/images/logo/logo.png';
const CUSTOM_DARK_LOGO = `${apiUrl}images/custom-logo.png`;
const CUSTOM_WHITE_LOGO = `${apiUrl}images/custom-logo-white.png`;
export function useLogo(): { white: string; dark: string } {
  const { isLicenseValid } = useSelector((state) => state.license);
  return {
    white: customLogoPaths
      ? isLicenseValid == null
        ? null
        : isLicenseValid
        ? CUSTOM_WHITE_LOGO
        : DEFAULT_WHITE_LOGO
      : DEFAULT_WHITE_LOGO,
    dark: customLogoPaths
      ? isLicenseValid == null
        ? null
        : isLicenseValid
        ? CUSTOM_DARK_LOGO
        : DEFAULT_DARK_LOGO
      : DEFAULT_DARK_LOGO
  };
}
