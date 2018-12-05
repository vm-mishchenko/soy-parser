# Soy parser

[![npm version](https://travis-ci.org/vm-mishchenko/soy-parser.svg?branch=master)](https://travis-ci.org/vm-mishchenko/soy-parser/builds)

Experimental soy parser.

#### Currently supported template

```closuretemplate
{template .parent visibility="private" kind="html" stricthtml="true"}
    {call .child}
        {param first}Test{/param}
        {param second: false /}
        {param third: $foo.bar /}
    {/call}
    Test
{/template}

{template .child kind="html" }
    {@param first: string}
    {@param second: bool}
    {@param third: bool}
{/template}
```

#### Currently supported grammar rules
```
document: (template_definition)*
template_definition: LCURLY TEMPLATE DOT ID template_attrs RCURLY template_params template_body LCURLY SLASH TEMPLATE RCURLY
template_attrs: (VISIBILITY|KIND|STRICT_HTML EQUAL STRING)*
template_params: (template_param)*
template_param: LCURLY ADDRESS PARAM QUESTION_MARK? ID COLUMN ID RCOLUMN | empty
template_body: (text|tag|template_call)*
text: ID
call_command: LCURLY CALL DOT? ID SLASH RCURLY |
    LCURLY CALL DOT? ID RCURLY (call_param)* LCRULY SLASH CALL RCURLY
call_param: LCURLY PARAM ID COLON short_package_param_value SLASH RCURLY |
    LCURLY PARAM ID (KIND EQUAL STRING)? SLASH RCURLY ID LCRULY SLASH PARAM RCURLY
short_package_param_value: STRING|BOOLEAN|INTEGER|package|(DOLLAR package)
package: ID (DOT ID)*
tag: empty
empty:
```