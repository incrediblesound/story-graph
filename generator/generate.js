var fs = require('fs');
var tokenizer = require('./src/tokenizer.js');
var parser = require('./src/parser.js');
var compiler = require('./src/compiler.js');

module.exports = (fileName, outputName) => {
  var body = fs.readFileSync(fileName).toString();

  var tokens = tokenizer(body);
  var structure = parser(tokens);
  var output = compiler(structure);

  fs.writeFileSync(outputName, output);
  /* eslint-disable no-console */
  console.log('Process complete.');
};
