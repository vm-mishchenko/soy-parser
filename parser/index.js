const TOKEN_TYPES = require('../lexer').TOKEN_TYPES;
const {
  ASTCallParam, ASTTemplateBody, ASTText,
  ASTCallCommand,
  ASTTag, ASTDocument, ASTTemplateDefinition, ASTTemplateParams, ASTTemplateParam
} = require('./ast');

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.getNextToken2();
  }

  document() {
    const templates = [];

    while (this.currentToken.type === TOKEN_TYPES.LCURLY) {
      const templateDefinition = this.templateDefinition();

      templates.push(templateDefinition);
    }

    return new ASTDocument(templates);
  }

  templateDefinition() {
    this.eat(TOKEN_TYPES.LCURLY);
    this.eat(TOKEN_TYPES.TEMPLATE);
    this.eat(TOKEN_TYPES.DOT);

    const name = this.currentToken.value;

    this.eat(TOKEN_TYPES.ID);
    this.eat(TOKEN_TYPES.RCURLY);

    const parameters = this.templateParams();
    const body = this.templateBody();

    // template is closing
    this.eat(TOKEN_TYPES.LCURLY);
    this.eat(TOKEN_TYPES.SLASH);
    this.eat(TOKEN_TYPES.TEMPLATE);
    this.eat(TOKEN_TYPES.RCURLY);

    return new ASTTemplateDefinition(name, parameters, body);
  }

  templateParams() {
    const tokenParams = [];

    while (this.currentToken.type === TOKEN_TYPES.LCURLY &&
    this.lexer.readFutureToken().type === TOKEN_TYPES.ADDRESS) {
      const templateParam = this.templateParam();

      tokenParams.push(templateParam);
    }

    return new ASTTemplateParams(tokenParams);
  }

  templateParam() {
    this.eat(TOKEN_TYPES.LCURLY);
    this.eat(TOKEN_TYPES.ADDRESS);
    this.eat(TOKEN_TYPES.PARAM);

    let isOptional = false;

    if (this.currentToken.type === TOKEN_TYPES.QUESTION_MARK) {
      // parameter is optional
      isOptional = true;

      this.eat(TOKEN_TYPES.QUESTION_MARK);
    }

    const parameterName = this.currentToken.value;

    this.eat(TOKEN_TYPES.ID);
    this.eat(TOKEN_TYPES.COLON);

    const parameterType = this.currentToken.type;

    this.eat(TOKEN_TYPES.ID);
    this.eat(TOKEN_TYPES.RCURLY);

    return new ASTTemplateParam(parameterName, isOptional, parameterType);
  }

  templateBody() {
    const body = [];

    while (this.currentToken.type === TOKEN_TYPES.ID ||
    (this.currentToken.type === TOKEN_TYPES.LCURLY &&
      this.lexer.readFutureToken().type === TOKEN_TYPES.CALL)) {
      if (this.currentToken.type === TOKEN_TYPES.ID) {
        body.push(this.text());
      } else if (this.currentToken.type === TOKEN_TYPES.LCURLY &&
        this.lexer.readFutureToken().type === TOKEN_TYPES.CALL) {
        body.push(this.callCommand());
      }
    }

    return new ASTTemplateBody();
  }

  text() {
    const textValue = this.currentToken.value;

    this.eat(TOKEN_TYPES.ID);

    return new ASTText(textValue);
  }

  callCommand() {
    this.eat(TOKEN_TYPES.LCURLY);
    this.eat(TOKEN_TYPES.CALL);

    if (this.currentToken.type === TOKEN_TYPES.DOT) {
      this.eat(TOKEN_TYPES.DOT);
    }

    const name = this.currentToken.value;
    const parameters = [];

    this.eat(TOKEN_TYPES.ID);

    if (this.currentToken.type === TOKEN_TYPES.SLASH) {
      // call command without extended param
      this.eat(TOKEN_TYPES.SLASH);
      this.eat(TOKEN_TYPES.RCURLY);
    } else {
      // call command with separate parameters
      this.eat(TOKEN_TYPES.RCURLY);

      while(this.currentToken.type === TOKEN_TYPES.LCURLY &&
      this.lexer.readFutureToken().type === TOKEN_TYPES.PARAM) {
        const callParam = this.callParam();

        parameters.push(callParam);
      }

      // extended call command
      this.eat(TOKEN_TYPES.LCURLY);
      this.eat(TOKEN_TYPES.SLASH);
      this.eat(TOKEN_TYPES.CALL);
      this.eat(TOKEN_TYPES.RCURLY);
    }

    return new ASTCallCommand(name, parameters);
  }

  callParam() {
    this.eat(TOKEN_TYPES.LCURLY);
    this.eat(TOKEN_TYPES.PARAM);

    const name = this.currentToken.value;

    this.eat(TOKEN_TYPES.ID);
    this.eat(TOKEN_TYPES.COLON);

    const value = this.currentToken.value;

    if(this.currentToken.type === TOKEN_TYPES.STRING) {
      this.eat(TOKEN_TYPES.STRING);
    } else if (this.currentToken.type === TOKEN_TYPES.BOOLEAN) {
      this.eat(TOKEN_TYPES.BOOLEAN);
    } else if (this.currentToken.type === TOKEN_TYPES.INTEGER) {
      this.eat(TOKEN_TYPES.INTEGER);
    }

    this.eat(TOKEN_TYPES.SLASH);
    this.eat(TOKEN_TYPES.RCURLY);

    return new ASTCallParam(name, value);
  }

  parse() {
    return this.document();
  }

  eat(tokenType) {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.getNextToken2();
    } else {
      throw new Error('Wrong grammar!');
    }
  }
}

exports.Parser = Parser;