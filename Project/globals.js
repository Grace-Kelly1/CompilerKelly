///<reference path='lexer.ts' />
///<reference path='logger.ts' />
///<reference path='token.ts' />
///<reference path='utils.ts' />
// / <reference path="cst.ts"/>
/// <reference path="Node.ts"/>
/// <reference path="parse.ts"/>
/// <reference path="Tree.ts"/>
/// <reference path="sa.ts"/>
/// <reference path="symbolTree.ts"/>
/// <reference path="ast.ts"/>
var _Lexer_; // Remember to construct this later.
var _Log_; // Remember to construct this later.
var _Tokens_ = [];
var _CurrentT_ = null;
var _TokenIndex_ = 0;
// var _CST_: TSCompiler.csTree = null;
//having same priblem from last time
var _Parser_;
var _Tree_;
var _SymbolTree_;
var _AST_;
var _SA_;
//Types of keywords
var PRINT = { type: 'PRINT', value: 'print' };
var WHILE = { type: 'WHILE', value: 'while' };
var IF = { type: 'IF', value: 'if' };
var INT = { type: 'INT', value: 'int' };
var STRING = { type: 'STRING', value: 'string' };
var BOOLEAN = { type: 'BOOLEAN', value: 'boolean' };
var FALSE = { type: 'FALSE', value: 'false' };
var TRUE = { type: 'TRUE', value: 'true' };
var _Keywords_ = [PRINT, WHILE, IF, INT, STRING, BOOLEAN, FALSE, TRUE];
//Types of punctuations
var L_BRACE = { type: 'L_BRACE', value: '{' };
var R_BRACE = { type: 'R_BRACE', value: '}' };
var L_PAREN = { type: 'L_PAREN', value: '(' };
var R_PAREN = { type: 'R_PAREN', value: ')' };
var ASSIGN = { type: 'ASSIGN', value: '=' };
var EQUAL = { type: 'EQUAL', value: '==' };
var N_EQUAL = { type: 'N_EQUAL', value: '!=' };
var CHAR = { type: 'CHAR', value: '' };
var DIGIT = { type: 'DIGIT', value: '' };
var SPACE = { type: 'SPACE', value: ' ' };
var QUOTE = { type: 'QUOTE', value: '"' };
var PLUS = { type: 'PLUS', value: '+' };
var EOP = { type: 'EOP', value: '$' };
var _Pun_ = [L_BRACE, R_BRACE, L_PAREN, R_PAREN, ASSIGN, EQUAL, N_EQUAL, CHAR, DIGIT, SPACE, QUOTE, PLUS, EOP];
//Type for ID
var ID = { type: 'ID', value: '' };
