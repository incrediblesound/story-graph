const generator = require('./generator/generate.js');
const { execSync } = require('child_process');

const fileName = process.argv[2];
const outputName = process.argv[3];

if (!fileName && !outputName) {
  console.log(`
    -- WORLD GENERATOR --
    npm run generate-world {input-file} {output-file}
    
    to see example world script:
    npm run generate-world -- --example
  `)
} else if (fileName === '--example') {
  const result = execSync('cat example.txt');
  console.log(result.toString());
} else {
  generator(fileName, outputName);
}

