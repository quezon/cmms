import {
  Box,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { customLogoPaths } from '../../config';
import { useEffect, useState } from 'react';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        display: flex;
        text-decoration: none;
        align-items: center;
        width: 53px;
        margin: 0 auto;
        font-weight: ${theme.typography.fontWeightBold};
`
);

const LogoSignWrapper = styled(Box)(
  () => `
        width: 52px;
        height: 52px;
`
);

const TooltipWrapper = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.colors.alpha.trueWhite[100],
    color: theme.palette.getContrastText(theme.colors.alpha.trueWhite[100]),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 'bold',
    borderRadius: theme.general.borderRadiusSm,
    boxShadow:
      '0 .2rem .8rem rgba(7,9,25,.18), 0 .08rem .15rem rgba(7,9,25,.15)'
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.colors.alpha.trueWhite[100]
  }
}));
interface OwnProps {
  white?: boolean;
}
const DEFAULT_WHITE_LOGO = '/static/images/logo/logo-white.png';
const DEFAULT_DARK_LOGO = '/static/images/logo/logo.png';
function Logo({ white }: OwnProps) {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const width = 60;
  const height = 60;
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [logoSrc, setLogoSrc] = useState<{ white?: string; dark: string }>({
    white: customLogoPaths ? null : DEFAULT_WHITE_LOGO,
    dark: customLogoPaths ? null : DEFAULT_DARK_LOGO
  });

  useEffect(() => {
    const checkCustomLogo = async () => {
      if (!customLogoPaths) return;
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

  return (
    <TooltipWrapper title="Atlas" arrow>
      <LogoWrapper to="/overview">
        <LogoSignWrapper>
          <img
            src={white ? logoSrc.white : logoSrc.dark}
            width={`${width * (mobile ? 0.7 : 1)}px`}
            height={`${height * (mobile ? 0.7 : 1)}px`}
          />
        </LogoSignWrapper>
      </LogoWrapper>
    </TooltipWrapper>
  );
}

export default Logo;
