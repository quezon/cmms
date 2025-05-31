const fs = require('fs');
const path = require('path');
const getRuntimeValue = (key, defaultValue = '') => {
  const envValue = process.env[`REACT_APP_${key}`] || process.env[key];
  return envValue || defaultValue;
};
const customLogoPaths = getRuntimeValue('LOGO_PATHS')
  ? JSON.parse(getRuntimeValue('LOGO_PATHS'))
  : null;
const basePath = '../public/static/images/logo';
const publicLogoWhitePath = path.join(
  __dirname,
  basePath + '/custom-logo-white.png'
);

const publicLogoDarkPath = path.join(__dirname, basePath + '/custom-logo.png');

if (customLogoPaths) {
  fs.copyFileSync(customLogoPaths.dark, publicLogoDarkPath);
  if (customLogoPaths.white)
    fs.copyFileSync(customLogoPaths.white, publicLogoWhitePath);

  console.log('Custom logos copied to public folder');
} else {
  console.log('No custom logo found or path not specified');
}
