const fs = require('fs');
const path = require('path');

const customLogoPaths = process.env.REACT_APP_LOGO_PATHS
  ? JSON.parse(process.env.REACT_APP_LOGO_PATHS)
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
