const generator = require('./generator/generate.js');

const fileName = process.argv[2];
const outputName = process.argv[3];

generator(fileName, outputName);
