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
///<reference path='symbol.ts' />
///<reference path='scope.ts' />
///<reference path='codeGen.ts' />
///<reference path='codeTable.ts' />
///<reference path='staticTable.ts' />
///<reference path='jumpTable.ts' />




var _Lexer_ : TSCompiler.lexer;  // Remember to construct this later.
var _Log_   : TSCompiler.logger; // Remember to construct this later.
var _Tokens_ = [];
var _CurrentT_: TSCompiler.Token = null;  
var _TokenIndex_: number = 0;
// var _CST_: TSCompiler.csTree = null;
//having same priblem from last time
var _Parser_ : TSCompiler.parse;
var _Tree_: TSCompiler.Tree;
var _SymbolTree_: TSCompiler.symbolTree;
var _AST_: TSCompiler.ast;
var _SA_: TSCompiler.sa;
var _Symbol_: TSCompiler.Symbol;
var _Scope_: TSCompiler.Scope;
var _codeGen_: TSCompiler.CodeGenerator;
var _codeTable_:TSCompiler.CodeTable;
var _staticTable_: TSCompiler.StaticTable;
var _jumpTable_: TSCompiler.JumpTable;


//Types of keywords
const PRINT = {type: 'PRINT', value: 'print'};
const WHILE = {type: 'WHILE', value: 'while'};
const IF = {type: 'IF', value: 'if'};
const INT = {type: 'INT', value: 'int'};
const STRING = {type: 'STRING', value: 'string'};
const BOOLEAN = {type: 'BOOLEAN', value: 'boolean'};
const FALSE = {type: 'FALSE', value: 'false'};
const TRUE = {type: 'TRUE', value: 'true'};

const _Keywords_ = [PRINT, WHILE, IF, INT, STRING, BOOLEAN, FALSE, TRUE];

//Types of punctuations
const L_BRACE = {type: 'L_BRACE', value: '{'};
const R_BRACE = {type: 'R_BRACE', value: '}'};
const L_PAREN = {type: 'L_PAREN', value: '('};
const R_PAREN = {type: 'R_PAREN', value: ')'};
const ASSIGN = {type: 'ASSIGN', value: '='};
const EQUAL = {type: 'EQUAL', value: '=='};
const N_EQUAL = {type: 'N_EQUAL', value: '!='};
const CHAR = {type: 'CHAR', value: ''};
const DIGIT = {type: 'DIGIT', value: ''};
const SPACE = {type: 'SPACE', value: ' '};
const QUOTE = {type: 'QUOTE', value: '"'};
const PLUS  = {type: 'PLUS', value: '+'};
const EOP = {type: 'EOP', value: '$'};

const _Pun_ = [L_BRACE, R_BRACE, L_PAREN, R_PAREN, ASSIGN, EQUAL, N_EQUAL, CHAR, DIGIT, SPACE, QUOTE, PLUS, EOP];

//Type for ID
const ID = {type: 'ID', value: ''};


