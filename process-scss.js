// process-scss.js
const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const chokidar = require('chokidar');

const stylesDir = path.join(__dirname, 'public/templates/assets/css');

const compileSass = (filePath) => {
    const outputFilePath = filePath.replace(/\.scss$/, '.css');

    sass.render({ file: filePath }, (err, result) => {
        if (err) {
            console.error(`Error compiling ${filePath}:`, err);
        } else {
            fs.writeFile(outputFilePath, result.css, (err) => {
                if (err) {
                    console.error(`Error writing CSS to ${outputFilePath}:`, err);
                } else {
                    console.log(`Compiled ${filePath} to ${outputFilePath}`);
                }
            });
        }
    });
};

// Initial compilation of all SCSS files
fs.readdir(stylesDir, (err, files) => {
    if (err) {
        console.error('Error reading styles directory:', err);
        return;
    }

    files.forEach((file) => {
        const filePath = path.join(stylesDir, file);
        if (filePath.endsWith('.scss')) {
            compileSass(filePath);
        }
    });
});

// Watch for changes
chokidar.watch(`${stylesDir}/*.scss`).on('change', (filePath) => {
    console.log(`Detected changes in ${filePath}. Recompiling...`);
    compileSass(filePath);
});
