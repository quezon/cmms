import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  Typography,
  styled,
  useTheme,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Switch
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Logo from 'src/components/LogoSign';
import { Link as RouterLink } from 'react-router-dom';
import LanguageSwitcher from 'src/layouts/ExtendedSidebarLayout/Header/Buttons/LanguageSwitcher';
import { ExpandMore, GitHub } from '@mui/icons-material';
import CheckCircleOutlineTwoToneIcon from '@mui/icons-material/CheckCircleOutlineTwoTone';
import { useState } from 'react';
import { pricingPlans, planFeatureCategories } from './pricingData';
import NavBar from '../../components/NavBar';
import Faq from './components/Faq';

const PricingWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`
);

function Pricing() {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  const [monthly, setMonthly] = useState<boolean>(true);
  const YEAR_MULTIPLIER: number = 10;

  return (
    <PricingWrapper>
      <Helmet>
        <title>Pricing - CMMS</title>
      </Helmet>
      <NavBar />

      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h1" component="h1" gutterBottom>
            {t('Choose your plan and get started')}
          </Typography>
          <Typography variant="subtitle1">
            {t(
              'Our software gives Maintenance and Reliability teams the tools they need to run Operations efficiently and effectively.'
            )}
          </Typography>
        </Box>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          mb={2}
        >
          <Stack direction={'row'} spacing={2} alignItems={'center'}>
            <Typography>Monthly</Typography>
            <Switch
              checked={!monthly}
              onChange={(event) => setMonthly(!event.target.checked)}
              sx={{ transform: 'scale(1.3)' }}
              size={'medium'}
            />
            <Typography>Annually (Save 20%)</Typography>
          </Stack>
        </Box>
        <Grid container spacing={2} justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} md={3} key={plan.id}>
              <Card
                sx={{
                  position: 'relative',
                  transition: 'all .2s',
                  '&:hover': {
                    transform: 'translateY(-10px)'
                  }
                }}
              >
                {plan.popular && (
                  <Box
                    sx={{
                      background: theme.palette.success.main,
                      color: theme.palette.success.contrastText,
                      padding: theme.spacing(0.5, 1),
                      borderRadius: theme.shape.borderRadius,
                      fontSize: theme.typography.pxToRem(9),
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      position: 'absolute',
                      top: 10,
                      right: theme.spacing(1)
                    }}
                  >
                    <span>✨ Most Popular</span>
                  </Box>
                )}
                <CardContent
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box mb={2}>
                    <Typography variant="h3" component="h3" gutterBottom>
                      {plan.name}
                    </Typography>
                    <Typography variant="subtitle2">
                      {plan.description}
                    </Typography>
                  </Box>

                  <Box mt={2} mb={3}>
                    {!parseFloat(plan.price) ? (
                      <Typography variant="h3" component="div">
                        {plan.price}
                      </Typography>
                    ) : (
                      <>
                        <Typography
                          variant="h2"
                          component="div"
                          color="primary"
                          sx={{ fontWeight: 'bold' }}
                        >
                          $
                          {monthly
                            ? plan.price
                            : parseFloat(plan.price) * YEAR_MULTIPLIER}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          {`/${monthly ? `month per user` : 'year per user'}`}
                        </Typography>
                      </>
                    )}
                  </Box>

                  <List sx={{ mt: 2, flexGrow: 1 }}>
                    {plan.features.slice(0, 5).map((feature, featureIdx) => (
                      <ListItem
                        key={`${plan.id}-${featureIdx}`}
                        sx={{
                          px: 0,
                          py: 0.6
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 34 }}>
                          <CheckCircleOutlineTwoToneIcon
                            sx={{ color: 'primary.main' }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>

                  <Box mt="auto" pt={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      component={RouterLink}
                      to="/account/register"
                      sx={{ mb: 1 }}
                    >
                      {plan.id === 'basic'
                        ? t('Get started')
                        : t('Try for free')}
                    </Button>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      align="center"
                      display="block"
                    >
                      {t('No Credit Card Required.')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box textAlign="center" my={6}>
          <Typography variant="h1" component="h1" gutterBottom>
            {t('Compare Plans and Pricing')}
          </Typography>
          <Typography variant="subtitle1">
            {t('See which plan is right for you')}
          </Typography>
        </Box>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box>
              <Grid container>
                <Grid item xs={12} md={4}>
                  {/* Empty grid for alignment */}
                </Grid>
                {pricingPlans.map((plan) => (
                  <Grid
                    item
                    xs={3}
                    md={2}
                    key={`compare-header-${plan.id}`}
                    sx={{ textAlign: 'center' }}
                  >
                    <Typography variant="h5" gutterBottom>
                      {plan.name}
                    </Typography>
                    {!parseFloat(plan.price) ? (
                      <Typography variant="body2" color="textSecondary">
                        {plan.price}
                      </Typography>
                    ) : (
                      <Typography variant="h6" color="primary">
                        $
                        {monthly
                          ? plan.price
                          : parseFloat(plan.price) * YEAR_MULTIPLIER}
                        {`/${monthly ? `month per user` : 'year per user'}`}
                      </Typography>
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      component={RouterLink}
                      to="/account/register"
                      sx={{ mt: 1, mb: 2 }}
                    >
                      {plan.id === 'basic'
                        ? t('Get started')
                        : t('Try for free')}
                    </Button>
                  </Grid>
                ))}
              </Grid>

              {planFeatureCategories.map((category, categoryIndex) => (
                <Box key={`category-${categoryIndex}`} sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, mt: 3, fontWeight: 'bold' }}
                  >
                    {category.name}
                  </Typography>

                  {category.features.map((feature, featureIndex) => (
                    <Grid
                      container
                      key={`feature-${categoryIndex}-${featureIndex}`}
                      sx={{
                        py: 1,
                        borderBottom: `1px solid ${theme.colors.alpha.black[10]}`,
                        backgroundColor: featureIndex % 2 ? '#F2F5F9' : 'white',
                        '&:hover': {
                          backgroundColor: theme.colors.alpha.black[5]
                        }
                      }}
                    >
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2">{feature.name}</Typography>
                      </Grid>

                      {pricingPlans.map((plan) => (
                        <Grid
                          item
                          xs={3}
                          md={2}
                          key={`feature-${categoryIndex}-${featureIndex}-${plan.id}`}
                          sx={{
                            textAlign: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          {feature.availability[plan.id] === true && (
                            <CheckCircleOutlineTwoToneIcon color="primary" />
                          )}
                          {feature.availability[plan.id] === false && (
                            <Typography variant="body2">–</Typography>
                          )}
                          {typeof feature.availability[plan.id] ===
                            'string' && (
                            <Typography variant="body2">
                              {feature.availability[plan.id]}
                            </Typography>
                          )}
                        </Grid>
                      ))}
                    </Grid>
                  ))}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
        <Faq />
      </Container>
    </PricingWrapper>
  );
}

export default Pricing;
