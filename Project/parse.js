/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="Tree.ts"/>
var TSCompiler;
(function (TSCompiler) {
    var parse = /** @class */ (function () {
        function parse() {
        }
        parse.prototype.parse = function () {
            _CurrentT_ = _Tokens_[_TokenIndex_];
            _Log_.printMessage("\nBeginning Parsing Session...");
            var cst = new TSCompiler.Tree();
            cst.addNode("Root", "branch", "", "", "", "");
            _Log_.printParseMessage("PARSE - parse()");
            this.parseProgram(cst);
            _Log_.printParseMessage("Parse Completed");
        };
        parse.prototype.parseProgram = function (cst) {
            cst.addNode("Program", "branch", "");
            this.parseBlock(cst);
            console.log(this);
            this.matchParse(EOP.type);
            _Log_.printParseMessage("PARSE - parseProgram()");
            cst.kick();
        };
        parse.prototype.parseBlock = function (cst) {
            cst.addNode("Block");
            this.matchParse(L_BRACE.type);
            this.parseStatmentL(cst);
            this.matchParse(R_BRACE.type);
            _Log_.printParseMessage("PARSE - parseBlock()");
            cst.kick();
        };
        parse.prototype.parseStatments = function (cst) {
            cst.addNode("Statement", "branch");
            switch (_CurrentT_.type) {
                case PRINT.type:
                    this.parsePrint(cst);
                    break;
                case ID.type:
                    this.parseAssign(cst);
                    break;
                case STRING.type:
                case INT.type:
                case BOOLEAN.type:
                    this.parseVar(cst);
                    break;
                case WHILE.type:
                    this.parseWhile(cst);
                    break;
                case IF.type:
                    this.parseIf(cst);
                    break;
                default:
                    this.parseBlock(cst);
            }
            _Log_.printParseMessage("PARSE - parseStatements()");
            cst.kick();
        };
        parse.prototype.parseStatmentL = function (cst) {
            if (_CurrentT_.type === PRINT.type ||
                _CurrentT_.type === ID.type ||
                _CurrentT_.type === INT.type ||
                _CurrentT_.type === BOOLEAN.type ||
                _CurrentT_.type === STRING.type ||
                _CurrentT_.type === L_BRACE.type ||
                _CurrentT_.type === WHILE.type ||
                _CurrentT_.type === IF.type) {
                cst.addNode("StatementList", "branch");
                this.parseStatments(cst);
                this.parseStatmentL(cst);
                _Log_.printParseMessage("PARSE - parseStatementL()");
                cst.kick();
            }
        };
        parse.prototype.parseVar = function (cst) {
            cst.addNode("VariableDeclaration", "branch");
            switch (_CurrentT_.type) {
                case STRING.type:
                    this.matchParse(STRING.type);
                    this.parseId(cst);
                    break;
                case INT.type:
                    this.matchParse(INT.type);
                    this.parseId(cst);
                    break;
                case BOOLEAN.type:
                    this.matchParse(BOOLEAN.type);
                    this.parseId(cst);
                    break;
                default:
                    _Log_.printError("We should never have gotten to this point.");
                    throw new Error("Something broke in parser.");
            }
            cst.kick();
        };
        parse.prototype.parsePrint = function (cst) {
            cst.addNode("PrintStatement", "branch");
            this.matchParse(PRINT.type);
            this.matchParse(L_PAREN.type);
            this.parseExpr(cst);
            this.matchParse(R_PAREN.type);
            cst.kick();
        };
        parse.prototype.parseAssign = function (cst) {
            cst.addNode("AssignmentStatement", "branch");
            this.parseId(cst);
            this.matchParse(ASSIGN.type);
            this.parseExpr(cst);
            cst.kick();
        };
        parse.prototype.parseWhile = function (cst) {
            cst.addNode("WhileStatement", "branch");
            this.matchParse(WHILE.type);
            this.parseBoolean(cst);
            this.parseBlock(cst);
            cst.kick();
        };
        parse.prototype.parseIf = function (cst) {
            cst.addNode("IfStatement", "branch");
            this.matchParse(IF.type);
            this.parseBoolean(cst);
            this.parseBlock(cst);
            cst.kick();
        };
        parse.prototype.parseExpr = function (cst) {
            cst.addNode("Expr", "branch");
            switch (_CurrentT_.type) {
                // IntExpr
                case DIGIT.type:
                    this.parseInt(cst);
                    break;
                // String
                case QUOTE.type:
                    this.parseString(cst);
                    break;
                // Boolean
                case L_PAREN.type:
                case TRUE.type:
                case FALSE.type:
                    this.parseBoolean(cst);
                    break;
                // ID
                case ID.type:
                    this.parseId(cst);
                    break;
                default:
                    _Log_.printParseError("We should never have gotten to this point.");
                    throw new Error("Something broke in parser.");
            }
            cst.kick();
        };
        parse.prototype.parseInt = function (cst) {
            cst.addNode("IntExpr", "branch");
            if (_CurrentT_.type === DIGIT.type) {
                this.matchParse(DIGIT.type);
                if (_CurrentT_.type === PLUS.type) {
                    this.matchParse(PLUS.type);
                    this.parseExpr(cst);
                }
            }
            cst.kick();
        };
        parse.prototype.parseString = function (cst) {
            cst.addNode("StringExpr", "branch");
            this.matchParse(QUOTE.type);
            this.parseChar(cst);
            this.matchParse(QUOTE.type);
            cst.kick();
        };
        parse.prototype.parseBoolean = function (cst) {
            cst.addNode("BooleanExpr", "branch");
            if (_CurrentT_.type === TRUE.type) {
                this.matchParse(TRUE.type);
            }
            else if (_CurrentT_.type === FALSE.type) {
                this.matchParse(FALSE.type);
            }
            else {
                this.matchParse(L_PAREN.type);
                this.parseExpr(cst);
                if (_CurrentT_.type === EQUAL.type) {
                    this.matchParse(EQUAL.type);
                    this.parseExpr(cst);
                    this.matchParse(R_PAREN.type);
                }
                else if (_CurrentT_.type === N_EQUAL.type) {
                    this.matchParse(N_EQUAL.type);
                    this.parseExpr(cst);
                    this.matchParse(R_PAREN.type);
                }
            }
            cst.kick();
        };
        parse.prototype.parseId = function (cst) {
            cst.addNode("Id", "branch");
            this.matchParse(ID.type);
            cst.kick();
        };
        parse.prototype.parseChar = function (cst) {
            if (_CurrentT_.type === SPACE.type) {
                cst.addNode("CharListSpace", "branch");
                this.matchParse(SPACE.type);
                this.parseChar(cst);
                cst.kick();
            }
            else
                (_CurrentT_.type === CHAR.type);
            {
                cst.addNode("CharListChar", "branch");
                this.matchParse(CHAR.type);
                this.parseChar(cst);
                cst.kick();
            }
        };
        parse.prototype.matchParse = function (type) {
            if (_CurrentT_.type === type) {
                //_Log_.printMessage("Parse: Successfully matched " + type + " token.");
                if (_TokenIndex_ < _Tokens_.length) {
                    _CurrentT_ = _Tokens_[_TokenIndex_ + 1];
                    _TokenIndex_++;
                }
            }
            else {
                _Log_.printParseError("Expected " + type + ", found " + _CurrentT_.type);
                throw new Error("Error in Parse. Ending execution.");
            }
            // if (_TokenIndex_ < _Tokens_.length) {
            //     _CurrentT_ = _Tokens_[_TokenIndex_ + 1];
            //     _TokenIndex_++;
            // }
        };
        return parse;
    }());
    TSCompiler.parse = parse;
})(TSCompiler || (TSCompiler = {}));
