# Soy parser

[![npm version](https://travis-ci.org/vm-mishchenko/soy-parser.svg?branch=master)](https://travis-ci.org/vm-mishchenko/soy-parser/builds)

Builds AST tree for soy template

#### Currently supported template

```closuretemplate
{template .parent}
    {call .child}
        {param first}Test{/param}
        {param second: false /}
    {/call}
    Test
{/template}

{template .child}
    {@param first: string}
    {@param second: bool}
{/template}
```

#### Currently supported grammar rules
```
document: (template_definition)*
template_definition: LCURLY TEMPLATE DOT ID RCURLY template_params template_body LCURLY SLASH TEMPLATE RCURLY
template_params: (template_param)*
template_param: LCURLY ADDRESS PARAM QUESTION_MARK? ID COLUMN ID RCOLUMN | empty
template_body: (text|tag|template_call)*
text: ID
call_command: LCURLY CALL DOT? ID SLASH RCURLY |
    LCURLY CALL DOT? ID RCURLY (call_param)* LCRULY SLASH CALL RCURLY
call_param: LCURLY PARAM ID COLON (STRING|BOOLEAN|INTEGER) SLASH RCURLY |
    LCURLY PARAM ID (ID EQUAL STRING)? SLASH RCURLY ID LCRULY SLASH PARAM RCURLY
tag: empty
empty:

```