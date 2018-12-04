const assert = require('assert');
const Lexer = require('../lexer').Lexer;
const Parser = require('./index').Parser;
const testHelpers = require('../test');

describe('Parser', () => {
  it('should parse empty template', () => {
      const lexer = new Lexer(testHelpers.getTestsProgram(`empty.soy`));
      const parser = new Parser(lexer);
      const ast = parser.parse();
  });

  it('should parse single empty template', () => {
      const lexer = new Lexer(
          testHelpers.getTestsProgram(`single-empty-template.soy`));
      const parser = new Parser(lexer);
      const ast = parser.parse();
  });

  it('should parse single empty template', () => {
    const lexer = new Lexer(
      testHelpers.getTestsProgram(`single-template-with-params.soy`));
    const parser = new Parser(lexer);
    const ast = parser.parse();
  });

  it('should parse single empty template', () => {
    const lexer = new Lexer(
      testHelpers.getTestsProgram(`single-text-template.soy`));
    const parser = new Parser(lexer);
    const ast = parser.parse();
  });

  it('should parse single empty template', () => {
    const lexer = new Lexer(
      testHelpers.getTestsProgram(`template-with-call.soy`));
    const parser = new Parser(lexer);
    const ast = parser.parse();
  });

  it('should parse single empty template', () => {
    const lexer = new Lexer(
      testHelpers.getTestsProgram(`call-params/text-param.soy`));
    const parser = new Parser(lexer);
    const ast = parser.parse();
  });
});