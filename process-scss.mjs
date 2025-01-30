// Import the necessary modules
import { writeFile, readdir } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { render } from 'node-sass';
import { watch } from 'chokidar';

// Get the file URL of the current module
const __filename = fileURLToPath(import.meta.url);
// Get the directory name from the file URL
const __dirname = dirname(__filename);

// Define the styles directory
const stylesDir = join(__dirname, 'public/templates/assets/css');

// Function to compile SCSS files
const compileSass = (filePath) => {
    const outputFilePath = filePath.replace(/\.scss$/, '.css');

    render({ file: filePath }, (err, result) => {
        if (err) {
            console.error(`Error compiling ${filePath}:`, err);
        } else {
            writeFile(outputFilePath, result.css, (err) => {
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
readdir(stylesDir, (err, files) => {
    if (err) {
        console.error('Error reading styles directory:', err);
        return;
    }

    files.forEach((file) => {
        const filePath = join(stylesDir, file);
        if (filePath.endsWith('.scss')) {
            compileSass(filePath);
        }
    });
});

// Watch for changes and recompile SCSS files
watch(`${stylesDir}/*.scss`).on('change', (filePath) => {
    console.log(`Detected changes in ${filePath}. Recompiling...`);
    compileSass(filePath);
});