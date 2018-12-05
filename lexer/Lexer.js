const Token = require('./Token');
const TOKEN_TYPES = require('./TokenType');

const RESERVED_KEYWORDS = {
  template: new Token(TOKEN_TYPES.TEMPLATE, TOKEN_TYPES.TEMPLATE),
  param: new Token(TOKEN_TYPES.PARAM, TOKEN_TYPES.PARAM),
  call: new Token(TOKEN_TYPES.CALL, TOKEN_TYPES.CALL),
  visibility: new Token(TOKEN_TYPES.VISIBILITY, TOKEN_TYPES.VISIBILITY),
  kind: new Token(TOKEN_TYPES.KIND, TOKEN_TYPES.KIND),
  stricthtml: new Token(TOKEN_TYPES.STRICT_HTML, TOKEN_TYPES.STRICT_HTML),
  'true': new Token(TOKEN_TYPES.BOOLEAN, true),
  'false': new Token(TOKEN_TYPES.BOOLEAN, false),
};

class Lexer {
  constructor(text) {
    this.pos = 0;
    this.text = text;
    this.currentChar = this.getCharInCurrentPosition_();

    // points to the next token that client will read
    this.currentTokenIndex = 0;
    this.tokens = this.getAllTokens_();
  }

  getCurrentTokenIndex() {
    return this.currentTokenIndex--;
  }

  getAllTokens() {
    return this.tokens;
  }

  getNextToken2() {
    const currentTokenIndex = this.currentTokenIndex;

    this.currentTokenIndex++;

    return this.tokens[currentTokenIndex];
  }

  // return next token without changing current token index
  // useful for conditions
  readFutureToken() {
    return this.tokens[this.currentTokenIndex];
  }

  // deprecated - should be private
  getNextToken() {
    let token;

    // need to fix it somehow?
    this.skipWhitespaces_();
    this.skipLineBreak_();
    this.skipWhitespaces_();
    this.skipLineBreak_();

    if (this.currentChar === '{') {
      token = new Token(TOKEN_TYPES.LCURLY);
    } else if (this.currentChar === '}') {
      token = new Token(TOKEN_TYPES.RCURLY);
    } else if (this.currentChar === '\'') {
      this.readNextChar_();

      token = new Token(TOKEN_TYPES.STRING, this.getString_());
    } else if (this.currentChar === '"') {
      this.readNextChar_();

      token = new Token(TOKEN_TYPES.STRING, this.getString_(true));
    } else if (this.currentChar === '.') {
      token = new Token(TOKEN_TYPES.DOT);
    } else if (this.currentChar === '@') {
      token = new Token(TOKEN_TYPES.ADDRESS);
    } else if (this.currentChar === '?') {
      token = new Token(TOKEN_TYPES.QUESTION_MARK);
    } else if (this.currentChar === '=') {
      token = new Token(TOKEN_TYPES.EQUAL);
    } else if (this.currentChar === '$') {
      token = new Token(TOKEN_TYPES.DOLLAR);
    } else if (this.currentChar === ':') {
      token = new Token(TOKEN_TYPES.COLON);
    } else if (this.currentChar === '/') {
      token = new Token(TOKEN_TYPES.SLASH);
    } else if (this.isAlpha_(this.currentChar)) {
      return this.id_();
    } else if (this.isInteger_(this.currentChar)) {
      token = new Token(TOKEN_TYPES.INTEGER,
          Number(this.getMultiIntegerChar_()));
    } else if (this.currentChar === '') {
      token = new Token(TOKEN_TYPES.EOF);
    } else {
      throw new Error(
          `Invalid character "${ this.currentChar }" at position ${ this.pos }`);
    }

    this.readNextChar_();

    return token;
  }

  getAllTokens_() {
    const tokens = [];

    let token;

    do {
      token = this.getNextToken();

      tokens.push(token);
    } while (token.type !== TOKEN_TYPES.EOF);

    return tokens;
  }

  getCharInCurrentPosition_() {
    if (this.pos > this.text.length - 1) {
      return "";
    } else {
      return this.text[this.pos];
    }
  }

  readNextChar_() {
    this.pos++;
    this.currentChar = this.getCharInCurrentPosition_();
  }

  isInteger_(value) {
    return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(value)
        !== -1;
  }

  isAlpha_(value) {
    return /^[A-Z]$/i.test(value);
  }

  skipWhitespaces_() {
    while (this.currentChar !== '' && this.currentChar === ' ') {
      this.readNextChar_();
    }
  }

  skipLineBreak_() {
    while (this.currentChar !== '' && this.currentChar === '\n') {
      this.readNextChar_();
    }
  }

  peekBeforeChar_() {
    const peekPos = this.pos - 1;

    if (peekPos < 0) {
      return '';
    } else {
      return this.text[peekPos];
    }
  }

  isId_(value) {
    return value !== '' && (this.isAlpha_(value) || this.isInteger_(value)
        || value === '_');
  }

  id_() {
    let result = '';
    const isText = this.peekBeforeChar_() === '\'' || this.peekBeforeChar_()
        === '"';

    while (this.isId_(this.currentChar)) {
      result += this.currentChar;

      this.readNextChar_();
    }

    if (!isText && RESERVED_KEYWORDS[result]) {
      return RESERVED_KEYWORDS[result];
    } else {
      return new Token(TOKEN_TYPES.ID, result);
    }
  }

  getMultiIntegerChar_() {
    let result = '';

    while (this.currentChar !== '' && this.isInteger_(this.currentChar)) {
      result += this.currentChar;

      this.readNextChar_();
    }

    return result;
  }

  getString_(isDoubleString) {
    let result = '';

    const breakSymbol = isDoubleString ? '"' : "'";

    while (this.currentChar !== breakSymbol || (this.currentChar === breakSymbol
        && this.peekBeforeChar_() === "\\")) {
      result += this.currentChar;

      this.readNextChar_();
    }

    return result;
  }
}

module.exports = Lexer;