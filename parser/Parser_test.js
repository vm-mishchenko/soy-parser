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

  it('should parse single template with params', () => {
    const lexer = new Lexer(
      testHelpers.getTestsProgram(`single-template-with-params.soy`));
    const parser = new Parser(lexer);
    const ast = parser.parse();
  });

  it('should parse template with attributes', () => {
    const lexer = new Lexer(
      testHelpers.getTestsProgram(`template-with-attributes.soy`));
    const parser = new Parser(lexer);
    const ast = parser.parse();
  });

  it('should parse single template with simple text', () => {
    const lexer = new Lexer(
      testHelpers.getTestsProgram(`single-text-template.soy`));
    const parser = new Parser(lexer);
    const ast = parser.parse();
  });

  it('should parse template with call', () => {
    const lexer = new Lexer(
      testHelpers.getTestsProgram(`template-with-call.soy`));
    const parser = new Parser(lexer);
    const ast = parser.parse();
  });

  it('should parse call with text param', () => {
    const lexer = new Lexer(
      testHelpers.getTestsProgram(`call-params/text-param.soy`));
    const parser = new Parser(lexer);
    const ast = parser.parse();
  });

  it('should parse call with boolean param', () => {
    const lexer = new Lexer(
      testHelpers.getTestsProgram(`call-params/boolean-param.soy`));
    const parser = new Parser(lexer);
    const ast = parser.parse();
  });

  it('should parse call with number param', () => {
    const lexer = new Lexer(
      testHelpers.getTestsProgram(`call-params/number-param.soy`));
    const parser = new Parser(lexer);
    const ast = parser.parse();
  });

  it('should parse call with extended param', () => {
    const lexer = new Lexer(
      testHelpers.getTestsProgram(`call-params/extended-param.soy`));
    const parser = new Parser(lexer);
    const ast = parser.parse();
  });

  it('should parse call with package param', () => {
    const lexer = new Lexer(
      testHelpers.getTestsProgram(`call-params/package-param.soy`));
    const parser = new Parser(lexer);
    const ast = parser.parse();
  });

  it('should parse call with link param', () => {
    const lexer = new Lexer(
      testHelpers.getTestsProgram(`call-params/link-param.soy`));
    const parser = new Parser(lexer);
    const ast = parser.parse();
  });

  it('should parse call with deep link param', () => {
    const lexer = new Lexer(
      testHelpers.getTestsProgram(`call-params/deep-link-param.soy`));
    const parser = new Parser(lexer);
    const ast = parser.parse();
  });

  it('should parse full template', () => {
    const lexer = new Lexer(
      testHelpers.getTestsProgram(`full/full.soy`));
    const parser = new Parser(lexer);
    const ast = parser.parse();
  });
});