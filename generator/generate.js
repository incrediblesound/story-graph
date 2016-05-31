const fs = require('fs');
const tokenizer = require('./src/tokenizer.js');
const parser = require('./src/parser.js');
const compiler = require('./src/compiler.js');

module.exports = (fileName, outputName) => {
  const body = fs.readFileSync(fileName).toString();

  const tokens = tokenizer(body);
  const structure = parser(tokens);
  const output = compiler(structure);

  fs.writeFileSync(outputName, output);
  /* eslint-disable no-console */
  console.log('Process complete.');
};
