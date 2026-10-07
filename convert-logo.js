const sharp = require('sharp');
const path = require('path');

sharp(path.join(__dirname, 'images', 'logo.svg'))
  .resize(500, 500)
  .png()
  .toFile(path.join(__dirname, 'images', 'logo.png'))
  .then(() => console.log('Done! Saved to images/logo.png'))
  .catch(err => console.error('Error:', err));
