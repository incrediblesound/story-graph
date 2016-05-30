var generator = require('./generator/generate.js');

var fileName = process.argv[2];
var outputName = process.argv[3];

generator(fileName, outputName);
