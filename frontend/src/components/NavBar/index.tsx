import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  styled,
  Typography
} from '@mui/material';
import Logo from '../LogoSign';
import { GitHub } from '@mui/icons-material';
import LanguageSwitcher from '../../layouts/ExtendedSidebarLayout/Header/Buttons/LanguageSwitcher';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
    width: 100%;
    display: flex;
    align-items: center;
    height: ${theme.spacing(10)};
    margin-bottom: ${theme.spacing(10)};
`
);

export default function NavBar() {
  const { t } = useTranslation();
  return (
    <HeaderWrapper>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center">
          <Box alignItems={'center'}>
            <Logo />
            <Typography
              style={{ cursor: 'pointer' }}
              fontSize={13}
              onClick={() => {
                window.open('https://www.intel-loop.com/', '_blank');
              }}
            >
              Powered by Intelloop
            </Typography>
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flex={1}
          >
            <Box />
            <Stack
              direction="row"
              spacing={{ xs: 1, md: 2 }}
              alignItems={'center'}
            >
              <Box
                sx={{
                  display: {
                    xs: 'none',
                    sm: 'block'
                  }
                }}
              >
                <Button
                  component={RouterLink}
                  to="/pricing"
                  sx={{
                    ml: 2,
                    size: { xs: 'small', md: 'medium' }
                  }}
                >
                  {t('Pricing')}
                </Button>
              </Box>
              <Box
                sx={{
                  display: {
                    xs: 'none',
                    sm: 'block'
                  }
                }}
              >
                <Button
                  component={'a'}
                  target={'_blank'}
                  href={'https://github.com/Grashjs/cmms'}
                  startIcon={<GitHub />}
                >
                  GitHub
                </Button>
              </Box>
              <Box
                sx={{
                  display: {
                    xs: 'none',
                    sm: 'block'
                  }
                }}
              >
                <LanguageSwitcher />
              </Box>
              <Button
                component={RouterLink}
                to="/app/work-orders"
                variant="outlined"
                sx={{
                  ml: 2,
                  size: { xs: 'small', md: 'medium' }
                }}
              >
                {t('login')}
              </Button>
              <Button
                component={RouterLink}
                to="/account/register"
                variant="contained"
                sx={{
                  ml: 2,
                  size: { xs: 'small', md: 'medium' }
                }}
              >
                {t('register')}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </HeaderWrapper>
  );
}
