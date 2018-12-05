const assert = require('assert');
const Lexer = require('./Lexer');
const TOKEN_TYPES = require('./TokenType');
const testHelpers = require('../test');

describe('Lexer', () => {
  it('should parse empty template', () => {
    const lexer = new Lexer(testHelpers.getTestsProgram(`empty.soy`));

    checkTokenSequenceType(lexer.getAllTokens(), [
      TOKEN_TYPES.EOF,
    ]);
  });

  it('should parse single empty template', () => {
    const lexer = new Lexer(
        testHelpers.getTestsProgram(`single-empty-template.soy`));

    checkTokenSequenceType(lexer.getAllTokens(), [
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.TEMPLATE,
      TOKEN_TYPES.DOT,
      TOKEN_TYPES.ID,
      TOKEN_TYPES.RCURLY,
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.SLASH,
      TOKEN_TYPES.TEMPLATE,
      TOKEN_TYPES.RCURLY,
      TOKEN_TYPES.EOF,
    ]);
  });

  it('should parse single template with text', () => {
    const lexer = new Lexer(
        testHelpers.getTestsProgram(`single-text-template.soy`));

    checkTokenSequenceType(lexer.getAllTokens(), [
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.TEMPLATE,
      TOKEN_TYPES.DOT,
      TOKEN_TYPES.ID,
      TOKEN_TYPES.RCURLY,
      TOKEN_TYPES.ID,
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.SLASH,
      TOKEN_TYPES.TEMPLATE,
      TOKEN_TYPES.RCURLY,
      TOKEN_TYPES.EOF,
    ]);
  });

  it('should parse two text templates', () => {
    const lexer = new Lexer(
        testHelpers.getTestsProgram(`two-text-template.soy`));

    checkTokenSequenceType(lexer.getAllTokens(), [
      // First template
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.TEMPLATE,
      TOKEN_TYPES.DOT,
      TOKEN_TYPES.ID,
      TOKEN_TYPES.RCURLY,
      TOKEN_TYPES.ID,
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.SLASH,
      TOKEN_TYPES.TEMPLATE,
      TOKEN_TYPES.RCURLY,

      // Second template
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.TEMPLATE,
      TOKEN_TYPES.DOT,
      TOKEN_TYPES.ID,
      TOKEN_TYPES.RCURLY,
      TOKEN_TYPES.ID,
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.SLASH,
      TOKEN_TYPES.TEMPLATE,
      TOKEN_TYPES.RCURLY,
      TOKEN_TYPES.EOF,
    ]);
  });

  it('should parse template with param', () => {
    const lexer = new Lexer(
        testHelpers.getTestsProgram(`single-template-with-params.soy`));

    checkTokenSequenceType(lexer.getAllTokens(), [
      // start template
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.TEMPLATE,
      TOKEN_TYPES.DOT,
      TOKEN_TYPES.ID,
      TOKEN_TYPES.RCURLY,

      // first param
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.ADDRESS,
      TOKEN_TYPES.PARAM,
      TOKEN_TYPES.ID,
      TOKEN_TYPES.COLON,
      TOKEN_TYPES.ID,
      TOKEN_TYPES.RCURLY,

      // second optional param
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.ADDRESS,
      TOKEN_TYPES.PARAM,
      TOKEN_TYPES.QUESTION_MARK,
      TOKEN_TYPES.ID,
      TOKEN_TYPES.COLON,
      TOKEN_TYPES.ID,
      TOKEN_TYPES.RCURLY,

      // end template
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.SLASH,
      TOKEN_TYPES.TEMPLATE,
      TOKEN_TYPES.RCURLY,
      TOKEN_TYPES.EOF,
    ]);
  });

  it('should parse template with call', () => {
    const lexer = new Lexer(
        testHelpers.getTestsProgram(`template-with-call.soy`));

    checkTokenSequenceType(lexer.getAllTokens(), [
      // start template
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.TEMPLATE,
      TOKEN_TYPES.DOT,
      TOKEN_TYPES.ID,
      TOKEN_TYPES.RCURLY,

      // first call
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.CALL,
      TOKEN_TYPES.DOT,
      TOKEN_TYPES.ID,
      TOKEN_TYPES.RCURLY,
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.SLASH,
      TOKEN_TYPES.CALL,
      TOKEN_TYPES.RCURLY,

      // second call
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.CALL,
      TOKEN_TYPES.DOT,
      TOKEN_TYPES.ID,
      TOKEN_TYPES.SLASH,
      TOKEN_TYPES.RCURLY,

      // end template
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.SLASH,
      TOKEN_TYPES.TEMPLATE,
      TOKEN_TYPES.RCURLY,
      TOKEN_TYPES.EOF,
    ]);
  });

  it('should parse template with attributes', () => {
    const lexer = new Lexer(
        testHelpers.getTestsProgram(`template-with-attributes.soy`));

    checkTokenSequenceType(lexer.getAllTokens(), [
      // start template
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.TEMPLATE,
      TOKEN_TYPES.DOT,
      TOKEN_TYPES.ID,

      // visibility attribute
      TOKEN_TYPES.VISIBILITY,
      TOKEN_TYPES.EQUAL,
      TOKEN_TYPES.STRING,

      // kind attribute
      TOKEN_TYPES.KIND,
      TOKEN_TYPES.EQUAL,
      TOKEN_TYPES.STRING,

      // strict html attribute
      TOKEN_TYPES.STRICT_HTML,
      TOKEN_TYPES.EQUAL,
      TOKEN_TYPES.STRING,

      TOKEN_TYPES.RCURLY,

      // end template
      TOKEN_TYPES.LCURLY,
      TOKEN_TYPES.SLASH,
      TOKEN_TYPES.TEMPLATE,
      TOKEN_TYPES.RCURLY,
      TOKEN_TYPES.EOF,
    ]);
  });

  describe('call-params', () => {
    it('should parse call with text param', () => {
      const lexer = new Lexer(
          testHelpers.getTestsProgram(`call-params/text-param.soy`));

      checkTokenSequenceType(lexer.getAllTokens(), [
        // start template
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.TEMPLATE,
        TOKEN_TYPES.DOT,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.RCURLY,

        // open call
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.CALL,
        TOKEN_TYPES.DOT,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.RCURLY,

        // param
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.PARAM,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.COLON,
        TOKEN_TYPES.STRING,
        TOKEN_TYPES.SLASH,
        TOKEN_TYPES.RCURLY,

        // close call
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.SLASH,
        TOKEN_TYPES.CALL,
        TOKEN_TYPES.RCURLY,

        // end template
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.SLASH,
        TOKEN_TYPES.TEMPLATE,
        TOKEN_TYPES.RCURLY,
        TOKEN_TYPES.EOF,
      ]);
    });

    it('should parse call with boolean param', () => {
      const lexer = new Lexer(
          testHelpers.getTestsProgram(`call-params/boolean-param.soy`));

      checkTokenSequenceType(lexer.getAllTokens(), [
        // start template
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.TEMPLATE,
        TOKEN_TYPES.DOT,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.RCURLY,

        // open call
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.CALL,
        TOKEN_TYPES.DOT,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.RCURLY,

        // param
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.PARAM,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.COLON,
        TOKEN_TYPES.BOOLEAN,
        TOKEN_TYPES.SLASH,
        TOKEN_TYPES.RCURLY,

        // close call
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.SLASH,
        TOKEN_TYPES.CALL,
        TOKEN_TYPES.RCURLY,

        // end template
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.SLASH,
        TOKEN_TYPES.TEMPLATE,
        TOKEN_TYPES.RCURLY,
        TOKEN_TYPES.EOF,
      ]);
    });

    it('should parse call with number param', () => {
      const lexer = new Lexer(
          testHelpers.getTestsProgram(`call-params/number-param.soy`));

      checkTokenSequenceType(lexer.getAllTokens(), [
        // start template
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.TEMPLATE,
        TOKEN_TYPES.DOT,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.RCURLY,

        // open call
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.CALL,
        TOKEN_TYPES.DOT,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.RCURLY,

        // param
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.PARAM,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.COLON,
        TOKEN_TYPES.INTEGER,
        TOKEN_TYPES.SLASH,
        TOKEN_TYPES.RCURLY,

        // close call
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.SLASH,
        TOKEN_TYPES.CALL,
        TOKEN_TYPES.RCURLY,

        // end template
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.SLASH,
        TOKEN_TYPES.TEMPLATE,
        TOKEN_TYPES.RCURLY,
        TOKEN_TYPES.EOF,
      ]);
    });

    it('should parse call with extended param', () => {
      const lexer = new Lexer(
          testHelpers.getTestsProgram(`call-params/extended-param.soy`));

      checkTokenSequenceType(lexer.getAllTokens(), [
        // start template
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.TEMPLATE,
        TOKEN_TYPES.DOT,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.RCURLY,

        // open call
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.CALL,
        TOKEN_TYPES.DOT,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.RCURLY,

        // param
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.PARAM,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.KIND,
        TOKEN_TYPES.EQUAL,
        TOKEN_TYPES.STRING,
        TOKEN_TYPES.RCURLY,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.SLASH,
        TOKEN_TYPES.PARAM,
        TOKEN_TYPES.RCURLY,

        // close call
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.SLASH,
        TOKEN_TYPES.CALL,
        TOKEN_TYPES.RCURLY,

        // end template
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.SLASH,
        TOKEN_TYPES.TEMPLATE,
        TOKEN_TYPES.RCURLY,
        TOKEN_TYPES.EOF,
      ]);
    });

    it('should parse call with package param', () => {
      const lexer = new Lexer(
          testHelpers.getTestsProgram(`call-params/package-param.soy`));

      checkTokenSequenceType(lexer.getAllTokens(), [
        // start template
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.TEMPLATE,
        TOKEN_TYPES.DOT,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.RCURLY,

        // open call
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.CALL,
        TOKEN_TYPES.DOT,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.RCURLY,

        // param
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.PARAM,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.COLON,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.DOT,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.SLASH,
        TOKEN_TYPES.RCURLY,

        // close call
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.SLASH,
        TOKEN_TYPES.CALL,
        TOKEN_TYPES.RCURLY,

        // end template
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.SLASH,
        TOKEN_TYPES.TEMPLATE,
        TOKEN_TYPES.RCURLY,
        TOKEN_TYPES.EOF,
      ]);
    });

    it('should parse call with link param', () => {
      const lexer = new Lexer(
          testHelpers.getTestsProgram(`call-params/link-param.soy`));

      checkTokenSequenceType(lexer.getAllTokens(), [
        // start template
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.TEMPLATE,
        TOKEN_TYPES.DOT,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.RCURLY,

        // open call
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.CALL,
        TOKEN_TYPES.DOT,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.RCURLY,

        // param
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.PARAM,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.COLON,
        TOKEN_TYPES.DOLLAR,
        TOKEN_TYPES.ID,
        TOKEN_TYPES.SLASH,
        TOKEN_TYPES.RCURLY,

        // close call
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.SLASH,
        TOKEN_TYPES.CALL,
        TOKEN_TYPES.RCURLY,

        // end template
        TOKEN_TYPES.LCURLY,
        TOKEN_TYPES.SLASH,
        TOKEN_TYPES.TEMPLATE,
        TOKEN_TYPES.RCURLY,
        TOKEN_TYPES.EOF,
      ]);
    });
  });
});

function checkTokenSequenceType(tokens, expectedSequence) {
  tokens.forEach((token, i) => {
    assert.strictEqual(token.type, expectedSequence[i]);
  });
}