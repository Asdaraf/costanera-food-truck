import tailwindcss from 'tailwindcss';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, 'public/css/styles.css');
const outputFile = path.join(__dirname, 'public/css/output.css');

async function build() {
  try {
    const css = fs.readFileSync(inputFile, 'utf8');
    const result = await tailwindcss.process(css, {
      from: inputFile,
      to: outputFile,
    });
    fs.writeFileSync(outputFile, result.css);
    console.log('CSS built successfully!');
  } catch (error) {
    console.error('Error building CSS:', error);
  }
}

build(); 