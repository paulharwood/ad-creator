#!/usr/bin/env node
import { execSync } from 'child_process';
import { join } from 'path';
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));

interface Arguments {
  blendFile: string;
  outputDir: string;
  frame: number;
  imagePath: string;
}
(async () => {
    const argv = await yargs
        .option('filename', { type: 'string', require: true })
        .option('content', { type: 'string', require: true })
        .alias('f', 'filename')
        .alias('c', 'content')
        .argv;

    fs.writeFile(argv.filename, '' + argv.content, error => {
        if (error) throw error;
        console.log(`File ${argv.filename} saved.`);
    });
})();

const argv = yargs.options({
    env: {
        alias: 'e',
        choices: ['dev', 'prod'] as const,
        demandOption: true,
        description: 'app environment'
    },
    port: {
        alias: 'p',
        default: 80,
        description: 'port'
    }
  })
    .argv;

console.log(argv);

const { blendFile, outputDir, frame, imagePath } = argv;

const blenderCommand = `blender -b "${blendFile}" -o "${join(
  outputDir,
  'output_####'
)}" -F PNG -f ${frame} -- --image-path "${imagePath}"`;

try {
  execSync(blenderCommand, { stdio: 'inherit' });
  console.log('Blender job completed successfully.');
} catch (error) {
  console.error('Error running Blender job:', error);
  process.exit(1);
}