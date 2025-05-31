import { useEffect, useRef, useState } from 'react';
import { customLogoPaths } from '../config';
import { useSelector } from '../store';

const DEFAULT_WHITE_LOGO = '/static/images/logo/logo-white.png';
const DEFAULT_DARK_LOGO = '/static/images/logo/logo.png';
export function useLogo(): { white: string; dark: string } {
  const { isLicenseValid } = useSelector((state) => state.license);
  const [logoSrc, setLogoSrc] = useState<{ white: string; dark: string }>({
    white: isLicenseValid
      ? customLogoPaths
        ? null
        : DEFAULT_WHITE_LOGO
      : DEFAULT_WHITE_LOGO,
    dark: isLicenseValid
      ? customLogoPaths
        ? null
        : DEFAULT_DARK_LOGO
      : DEFAULT_DARK_LOGO
  });

  useEffect(() => {
    const checkCustomLogo = async () => {
      if (!customLogoPaths || !isLicenseValid) return;
      try {
        let isDarkLogoPresent = false;
        const customDarkLogoPath = '/static/images/logo/custom-logo.png';
        const response = await fetch(customDarkLogoPath);
        if (response.ok) {
          isDarkLogoPresent = true;
          setLogoSrc((prevState) => ({
            ...prevState,
            dark: customDarkLogoPath
          }));
        }
        if (isDarkLogoPresent) {
          const customWhiteLogoPath =
            '/static/images/logo/custom-logo-white.png';
          const whiteResponse = await fetch(customWhiteLogoPath);
          if (whiteResponse.ok) {
            setLogoSrc((prevState) => ({
              ...prevState,
              white: customWhiteLogoPath
            }));
          } else
            setLogoSrc((prevState) => ({
              ...prevState,
              white: prevState.dark
            }));
        } else {
          setLogoSrc({
            white: DEFAULT_WHITE_LOGO,
            dark: DEFAULT_DARK_LOGO
          });
        }
      } catch (error) {
        console.log('Using default logo');
      }
    };

    checkCustomLogo();
  }, []);

  return logoSrc;
}
