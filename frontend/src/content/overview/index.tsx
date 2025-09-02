import { Box, Container, Grid, Link, styled, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Hero from './Hero';
import Highlights from './Highlights';
import NavBar from '../../components/NavBar';
import { useEffect } from 'react';
import { isCloudVersion } from '../../config';
import { useBrand } from '../../hooks/useBrand';
import { useSelector } from '../../store';
import {
  Facebook,
  Twitter,
  Instagram,
  Phone,
  Mail,
  Sms
} from '@mui/icons-material';

const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`
);

const FooterWrapper = styled(Box)(
  ({ theme }) => `
    background: ${theme.colors.alpha.black[100]};
    color: ${theme.colors.alpha.white[70]};
    padding: ${theme.spacing(4)} 0;
`
);

const FooterLink = styled(Link)(
  ({ theme }) => `
    color: ${theme.colors.alpha.white[70]};
    text-decoration: none;

    &:hover {
      color: ${theme.colors.alpha.white[100]};
      text-decoration: underline;
    }
`
);

const SectionHeading = styled(Typography)(
  ({ theme }) => `
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.colors.alpha.white[100]};
    margin-bottom: ${theme.spacing(2)};
`
);

function Footer() {
  const navigate = useNavigate();
  return (
    <FooterWrapper>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <SectionHeading variant="h5">Contact</SectionHeading>
            <Box
              sx={{ cursor: 'pointer' }}
              onClick={() =>
                (window.location.href = 'mailto:contact@atlas-cmms.com')
              }
              display="flex"
              alignItems="center"
            >
              <Mail fontSize="small" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                contact@atlas-cmms.com
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <Phone fontSize="small" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                +212630690050
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <Sms fontSize="small" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                +212630690050
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <SectionHeading variant="h5">Company</SectionHeading>
            <FooterLink href="/pricing">Pricing</FooterLink>
            <br />
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <br />
            <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
          </Grid>
          <Grid item xs={12} md={3}>
            <SectionHeading variant="h5">Social</SectionHeading>
            <FooterLink href="#">
              <Facebook />
            </FooterLink>
            <FooterLink href="#" sx={{ ml: 1 }}>
              <Twitter />
            </FooterLink>
            <FooterLink href="#" sx={{ ml: 1 }}>
              <Instagram />
            </FooterLink>
          </Grid>
          <Grid item xs={12} md={3}>
            <SectionHeading variant="h5">Mobile apps</SectionHeading>
            {/* Add app store badges here */}
            <Typography variant="body2">Coming soon...</Typography>
          </Grid>
        </Grid>
        <Box mt={4} textAlign="center">
          <Typography variant="body2">
            © {new Date().getFullYear()} Company. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </FooterWrapper>
  );
}

function Overview() {
  const { t }: { t: any } = useTranslation();
  const navigate = useNavigate();
  const { isLicenseValid } = useSelector((state) => state.license);
  const brandConfig = useBrand();

  useEffect(() => {
    if (
      !isCloudVersion ||
      (isCloudVersion && isLicenseValid != null && !isLicenseValid)
    )
      console.log('license is invalid');
    // navigate('/account/login');
  }, [isCloudVersion, isLicenseValid]);

  return (
    <OverviewWrapper>
      <Helmet>
        <title>{brandConfig.name}</title>
      </Helmet>
      <NavBar />
      <Hero />
      <Highlights />
      <Footer />
    </OverviewWrapper>
  );
}

export default Overview;
