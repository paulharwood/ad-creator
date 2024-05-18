const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

console.log('STARTING');

// Directory containing the images
const inputDir = './public/ads/RS_CREAT_100G/';

// Directory to save the processed images
const outputDir = './public/ads/RS_CREAT_100G/processed/';
// Brightness factor (1 is no change, >1 is brighter, <1 is darker)
// const brightnessFactor = 1;
const contrast = 1.2;
const brightness = 1.04;
const saturation = 1.58;
// Ensure the output directory exists
fs.ensureDirSync(outputDir);

// Process each image in the input directory
fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error('Error reading the input directory', err);
    return;
  }

  files.forEach(file => {
    console.log(file);
    const inputFilePath = path.join(inputDir, file);
    const outputFilePath = path.join(outputDir, file);

    // Ensure the file is an image
    if (/\.(jpg|jpeg|png|tiff|webp|bmp)$/i.test(file)) {
      sharp(inputFilePath)
        .sharpen()
        .linear(contrast, -(128 * contrast) + 128)
        .modulate({ brightness: brightness, saturation: saturation })
        .toFile(outputFilePath)
        .then(() => {
          console.log(`Processed ${file}`);
        })
        .catch(err => {
          console.error(`Error processing ${file}`, err);
        });
    }
  });
});
