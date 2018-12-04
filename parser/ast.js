class AST {
}

class ASTDocument extends AST {
  constructor(templates) {
    super();

    this.templates = templates;
  }
}

class ASTTemplateDefinition extends AST {
  constructor(name, parameters, body) {
    super();

    this.name = name;
    this.parameters = parameters;
    this.body = body;
  }
}

class ASTTemplateParams extends AST {
  constructor(parameters) {
    super();

    this.parameters = parameters;
  }
}

class ASTTemplateParam extends AST {
  constructor(name, isOptional, type) {
    super();

    this.name = name;
    this.isOptional = isOptional;
    this.type = type;
  }
}

class ASTTemplateBody extends AST {
  constructor() {
    super();
  }
}




class ASTText extends AST {
  constructor(value) {
    super();

    this.value = value;
  }
}

class ASTCallCommand extends AST {
  constructor(name, parameters) {
    super();

    this.name = name;
    this.parameters = parameters;
  }
}

class ASTCallParam extends AST {
  constructor(name, value, type) {
    super();

    this.name = name;
    this.value = value;
    this.type = type;
  }
}

class ASTTag extends AST {
  constructor(type) {
    super();

    this.type = type;
  }
}

module.exports = {
  ASTDocument,
  ASTTemplateDefinition,
  ASTTemplateParams,
  ASTTemplateParam,
  ASTTemplateBody,
  ASTText,
  ASTCallCommand,
  ASTCallParam,
  ASTTag
};