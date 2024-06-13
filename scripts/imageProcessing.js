const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

console.log('STARTING');

// Retrieve SKU from command-line arguments
const args = process.argv.slice(2);
const sku = args[0];

if (!sku) {
  console.error('Please provide the SKU as an argument.');
  process.exit(1);
}

// Construct input and output directories
const inputDir = path.join('./public/ads', sku);
const outputDir = path.join(inputDir, 'p');

console.log(`Input Directory: ${inputDir}`);
console.log(`Output Directory: ${outputDir}`);

// Ensure the output directory exists
fs.ensureDirSync(outputDir);

// Brightness factor (1 is no change, >1 is brighter, <1 is darker)
const contrast = 1.1;
const brightness = 1.01;
const saturation = 1.4;

// Process each image in the input directory
fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error('Error reading the input directory', err);
    return;
  }

  const processedFilesByLang = {};

  files.forEach(file => {
    console.log(file);
    const inputFilePath = path.join(inputDir, file);

    // Ensure the file is an image
    if (/\.(jpg|jpeg|png|tiff|webp|bmp)$/i.test(file)) {
      // Extract language code from the filename (assuming it's the part before the file extension)
      const langCodeMatch = file.match(/([a-z]{2})\.(jpg|jpeg|png|tiff|webp|bmp)$/i);
      if (!langCodeMatch) {
        console.error(`Cannot determine language code for file: ${file}`);
        return;
      }
      const langCode = langCodeMatch[1];

      // Create language-specific output directory
      const langDir = path.join(outputDir, langCode);
      fs.ensureDirSync(langDir);

      const outputFilePath = path.join(langDir, file);

      sharp(inputFilePath)
        .sharpen()
        // .linear(contrast, -(128 * contrast) + 128)
        // .modulate({ brightness: brightness, saturation: saturation })
        .toFile(outputFilePath)
        .then(() => {
          console.log(`Processed ${file}`);
          if (!processedFilesByLang[langCode]) {
            processedFilesByLang[langCode] = [];
          }
          processedFilesByLang[langCode].push(file);

          // Check if all files have been processed
          if (Object.values(processedFilesByLang).flat().length === files.filter(f => /\.(jpg|jpeg|png|tiff|webp|bmp)$/i.test(f)).length) {
            createIndexHtml(processedFilesByLang);
          }
        })
        .catch(err => {
          console.error(`Error processing ${file}`, err);
        });
    }
  });
});

function createIndexHtml(processedFilesByLang) {
  const mainIndexPath = path.join(outputDir, 'index.html');
  let mainHtmlContent = `<!DOCTYPE html><html><head><title>${sku}</title><link rel="stylesheet" type="text/css" href="/ads/ads.css"></head><body><h1>${sku}</h1>`;
  
  mainHtmlContent += `<ul><li><a href="/sku/${sku}/${sku}_label_front.pdf" target="_blank">Front Label</a></li> <li><a href="/sku/${sku}/${sku}_label_back.pdf" target="_blank">Back Label</a></li></ul>`;
  mainHtmlContent += `<h2>${sku} Images</h2><ul>`;

  for (const [langCode, files] of Object.entries(processedFilesByLang)) {
    const langDir = path.join(outputDir, langCode);
    const langIndexPath = path.join(langDir, 'index.html');
    let langHtmlContent = `<!DOCTYPE html><html><head><title>${sku} (${langCode})</title><link rel="stylesheet" type="text/css" href="/ads/ads.css"></head><body><h1>${sku} (${langCode})</h1><ul>`;

    files.forEach(file => {
      langHtmlContent += `<li><a href="./${file}">${file}</a></li>`;
    });

    langHtmlContent += '</ul></body></html>';

    fs.writeFile(langIndexPath, langHtmlContent, err => {
      if (err) {
        console.error(`Error writing ${langCode}/index.html`, err);
      } else {
        console.log(`${langCode}/index.html created successfully`);
      }
    });

    mainHtmlContent += `<li><a href="./${langCode}/index.html" target="_blank">${langCode}</a></li>`;
  }

  mainHtmlContent += '</ul></body></html>';

  fs.writeFile(mainIndexPath, mainHtmlContent, err => {
    if (err) {
      console.error('Error writing main index.html', err);
    } else {
      console.log('Main index.html created successfully');
    }
  });
}
