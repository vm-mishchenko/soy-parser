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

    const attrs = this.templateAttrs();

    this.eat(TOKEN_TYPES.RCURLY);

    const parameters = this.templateParams();
    const body = this.templateBody();

    // template is closing
    this.eat(TOKEN_TYPES.LCURLY);
    this.eat(TOKEN_TYPES.SLASH);
    this.eat(TOKEN_TYPES.TEMPLATE);
    this.eat(TOKEN_TYPES.RCURLY);

    return new ASTTemplateDefinition(name, parameters, body, attrs);
  }

  templateAttrs() {
    const attrs = [];

    while(this.currentToken.type === TOKEN_TYPES.VISIBILITY ||
    this.currentToken.type === TOKEN_TYPES.KIND ||
    this.currentToken.type === TOKEN_TYPES.STRICT_HTML) {
      let name;

      if(this.currentToken.type === TOKEN_TYPES.VISIBILITY) {
        this.eat(TOKEN_TYPES.VISIBILITY);
        name = TOKEN_TYPES.VISIBILITY;
      } else if (this.currentToken.type === TOKEN_TYPES.KIND) {
        this.eat(TOKEN_TYPES.KIND);
        name = TOKEN_TYPES.KIND;
      } else if (this.currentToken.type === TOKEN_TYPES.STRICT_HTML) {
        this.eat(TOKEN_TYPES.STRICT_HTML);
        name = TOKEN_TYPES.STRICT_HTML;
      }

      this.eat(TOKEN_TYPES.EQUAL);

      attrs.push({
        name,
        value: this.currentToken.value
      });

      this.eat(TOKEN_TYPES.STRING);
    }

    return attrs;
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

    let type;
    let value;
    const name = this.currentToken.value;

    this.eat(TOKEN_TYPES.ID);

    if(this.currentToken.type === TOKEN_TYPES.COLON) {
      // short param call
      this.eat(TOKEN_TYPES.COLON);

      const value = this.shortPackageParamValue();

      this.eat(TOKEN_TYPES.SLASH);
      this.eat(TOKEN_TYPES.RCURLY);
    } else {
      // extended param call
      if(this.currentToken.type === TOKEN_TYPES.KIND){
        this.eat(TOKEN_TYPES.KIND);
        this.eat(TOKEN_TYPES.EQUAL);

        type = this.currentToken.value;

        this.eat(TOKEN_TYPES.STRING);
      }

      this.eat(TOKEN_TYPES.RCURLY);

      value = this.currentToken.value;

      this.eat(TOKEN_TYPES.ID);
      this.eat(TOKEN_TYPES.LCURLY);
      this.eat(TOKEN_TYPES.SLASH);
      this.eat(TOKEN_TYPES.PARAM);
      this.eat(TOKEN_TYPES.RCURLY);
    }

    return new ASTCallParam(name, value, type);
  }

  shortPackageParamValue() {
    let value = this.currentToken.value;

    if(this.currentToken.type === TOKEN_TYPES.STRING) {
      this.eat(TOKEN_TYPES.STRING);
    } else if (this.currentToken.type === TOKEN_TYPES.BOOLEAN) {
      this.eat(TOKEN_TYPES.BOOLEAN);
    } else if (this.currentToken.type === TOKEN_TYPES.INTEGER) {
      this.eat(TOKEN_TYPES.INTEGER);
    } else if (this.currentToken.type === TOKEN_TYPES.ID) {
      value = this.package();
    } else if(this.currentToken.type === TOKEN_TYPES.DOLLAR) {
      this.eat(TOKEN_TYPES.DOLLAR);

      value = `${this.package()}`;
    }

    return value;
  }

  package() {
    let value = this.currentToken.value;

    this.eat(TOKEN_TYPES.ID);

    while(this.currentToken.type === TOKEN_TYPES.DOT) {
      this.eat(TOKEN_TYPES.DOT);

      value += `.${this.currentToken.value}`;

      this.eat(TOKEN_TYPES.ID);
    }

    return value;
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