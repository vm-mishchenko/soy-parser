const fs = require('fs');

function getProgram(pathToFile) {
  return fs.readFileSync(pathToFile).toString();
}

function getTestsProgram(fileName) {
  return fs.readFileSync(`${__dirname}/artifacts/${fileName}`).toString();
}

exports.getProgram = getProgram;
exports.getTestsProgram = getTestsProgram;
