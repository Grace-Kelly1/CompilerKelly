/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="Tree.ts"/>
/// <reference path="symbolTree.ts"/>
var TSCompiler;
(function (TSCompiler) {
    var ast = /** @class */ (function () {
        function ast() {
        }
        //Need to count error to print 
        //_Log_.printCSTMessage("CST	for	program: Skipped due to	PARSE error(s)");
        //Need to fix where the parse programs print 
        ast.prototype.Ast = function () {
            var parseCompleted = true;
            _TokenIndex_ = 0;
            _CurrentT_ = _Tokens_[_TokenIndex_];
            //console.log(_CurrentT_.type);
            //_Log_.printMessage("\nBeginning AST Session...");
            _Tree_ = new TSCompiler.Tree();
            //_Tree_ .addNode("Root", "branch");
            this.parseProgram();
            //_Log_.printParseMessage("Parse Completed");
            if (parseCompleted === true) {
                //_Tree_: new TSCompiler.Tree();
                //console.log(_Tree_.toString());
                // _Log_.printCSTMessage("\nCST for program" + p + "...");
                _Log_.printAST();
                _Log_.logTokens();
            }
        };
        ast.prototype.parseProgram = function () {
            this.parseBlock();
            //console.log("this = " + this);
            //this.matchParse(EOP.type);
            _Tree_.kick();
            _Tree_.kick();
        };
        ast.prototype.parseBlock = function () {
            _Tree_.addNode("Block", "branch");
            this.matchParse(L_BRACE.type);
            //_Tree_.addNode("{", "leaf");
            this.parseStatmentL();
            //_Tree_.kick();
            //_Tree_.addNode("StatementList", "")
            this.matchParse(R_BRACE.type);
            //_Tree_.addNode("}", "leaf");
            _Tree_.kick();
        };
        ast.prototype.parseStatmentL = function () {
            //_Tree_ .addNode("StatementList", "branch");
            if (_CurrentT_.type === PRINT.type ||
                _CurrentT_.type === ID.type ||
                _CurrentT_.type === INT.type ||
                _CurrentT_.type === BOOLEAN.type ||
                _CurrentT_.type === STRING.type ||
                _CurrentT_.type === L_BRACE.type ||
                _CurrentT_.type === WHILE.type ||
                _CurrentT_.type === IF.type) {
                this.parseStatments();
                //this.parseStatmentL();
                _Tree_.kick();
            }
        };
        ast.prototype.parseStatments = function () {
            switch (_CurrentT_.type) {
                case PRINT.type:
                    this.parsePrint();
                    break;
                case ID.type:
                    this.parseAssign();
                    break;
                case STRING.type:
                case INT.type:
                case BOOLEAN.type:
                    this.parseVar();
                    break;
                case WHILE.type:
                    this.parseWhile();
                    break;
                case IF.type:
                    this.parseIf();
                    break;
                default:
                    this.parseBlock();
            }
            _Tree_.kick();
        };
        ast.prototype.parseVar = function () {
            _Tree_.addNode("VariableDeclaration", "branch");
            switch (_CurrentT_.type) {
                case STRING.type:
                    this.matchParse(STRING.type);
                    this.parseId();
                    break;
                case INT.type:
                    this.matchParse(INT.type);
                    this.parseId();
                    break;
                case BOOLEAN.type:
                    this.matchParse(BOOLEAN.type);
                    this.parseId();
                    break;
                default:
                    _Log_.printError("Expected String or Int or Boolean");
                //throw new Error("Something broke in parser.");
            }
            _Tree_.kick();
        };
        ast.prototype.parsePrint = function () {
            _Tree_.addNode("PrintStatement", "branch");
            this.matchParse(PRINT.type);
            this.matchParse(L_PAREN.type);
            this.parseExpr();
            this.matchParse(R_PAREN.type);
            _Tree_.kick();
        };
        ast.prototype.parseAssign = function () {
            _Tree_.addNode("AssignmentStatement", "branch");
            this.parseId();
            this.matchParse(ASSIGN.type);
            this.parseExpr();
            _Tree_.kick();
        };
        ast.prototype.parseWhile = function () {
            _Tree_.addNode("WhileStatement", "branch");
            this.matchParse(WHILE.type);
            this.parseBoolean();
            this.parseBlock();
            _Tree_.kick();
        };
        ast.prototype.parseIf = function () {
            _Tree_.addNode("IfStatement", "branch");
            this.matchParse(IF.type);
            this.parseBoolean();
            this.parseBlock();
            _Tree_.kick();
        };
        ast.prototype.parseExpr = function () {
            switch (_CurrentT_.type) {
                // IntExpr
                case DIGIT.type:
                    this.parseInt();
                    break;
                // String
                case QUOTE.type:
                    this.parseString();
                    break;
                // Boolean
                case L_PAREN.type:
                case TRUE.type:
                case FALSE.type:
                    this.parseBoolean();
                    break;
                // ID
                case ID.type:
                    this.parseId();
                    break;
                default:
                    _Log_.printParseError("Expected to finish assigning variable");
                //throw new Error("Something broke in parser.");
            }
            _Tree_.kick();
        };
        ast.prototype.parseInt = function () {
            _Tree_.addNode(_CurrentT_.value, "branch");
            //console.log(_CurrentT_.value);
            if (_CurrentT_.type === DIGIT.type) {
                //_Tree_.addNode(_CurrentT_.value, "leaf");
                this.matchParse(DIGIT.type);
                _Tree_.addNode(_CurrentT_.value, "leaf");
                if (_CurrentT_.type === PLUS.type) {
                    this.matchParse(PLUS.type);
                    this.parseExpr();
                }
            }
            _Tree_.kick();
        };
        ast.prototype.parseString = function () {
            _Tree_.addNode(_CurrentT_.value, "branch");
            this.matchParse(QUOTE.type);
            this.parseChar();
            this.matchParse(QUOTE.type);
            _Tree_.kick();
        };
        ast.prototype.parseBoolean = function () {
            if (_CurrentT_.type === TRUE.type) {
                _Tree_.addNode(_CurrentT_.value, "leaf");
                this.matchParse(TRUE.type);
            }
            else if (_CurrentT_.type === FALSE.type) {
                _Tree_.addNode(_CurrentT_.value, "leaf");
                this.matchParse(FALSE.type);
            }
            else {
                this.matchParse(L_PAREN.type);
                this.parseExpr();
                if (_CurrentT_.type === EQUAL.type) {
                    this.matchParse(EQUAL.type);
                    this.parseExpr();
                    this.matchParse(R_PAREN.type);
                }
                else if (_CurrentT_.type === N_EQUAL.type) {
                    this.matchParse(N_EQUAL.type);
                    this.parseExpr();
                    this.matchParse(R_PAREN.type);
                }
            }
            _Tree_.kick();
        };
        ast.prototype.parseId = function () {
            //_Tree_.addNode(_CurrentT_.type, "leaf");
            this.matchParse(ID.type);
            _Tree_.kick();
        };
        ast.prototype.parseChar = function () {
            if (_CurrentT_.type === SPACE.type) {
                this.matchParse(SPACE.type);
                this.parseChar();
                _Tree_.kick();
            }
            else
                (_CurrentT_.type === CHAR.type);
            {
                //_Tree_.addNode(_CurrentT_.value, "leaf");
                this.matchParse(CHAR.type);
                // if(_CurrentT_.type === QUOTE.type){
                //     this.parseString();
                // }
                // else{
                this.parseChar();
                // }
                _Tree_.kick();
            }
        };
        ast.prototype.matchParse = function (type) {
            if (_CurrentT_.value === "{" ||
                _CurrentT_.value === "}" ||
                _CurrentT_.value === "(" ||
                _CurrentT_.value === ")" ||
                _CurrentT_.value === "print" ||
                _CurrentT_.value === "while" ||
                _CurrentT_.value === "if" ||
                _CurrentT_.value === "=" ||
                _CurrentT_.value === "==" ||
                _CurrentT_.value === "!=" ||
                _CurrentT_.value === '"' ||
                _CurrentT_.value === "+") {
                console.log("NO {");
            }
            else if (_CurrentT_.type === type) {
                console.log(_CurrentT_.value);
                _Tree_.addNode(_CurrentT_.value, "leaf");
                //_Log_.printMessage("Parse: Successfully matched " + type + " token.");
            }
            else {
                _Log_.printParseError("Expected " + type + ", found " + _CurrentT_.type);
                // throw new Error("Error in Parse. Ending execution.");
            }
            if (_TokenIndex_ < _Tokens_.length) {
                _CurrentT_ = _Tokens_[_TokenIndex_ + 1];
                _TokenIndex_++;
            }
        };
        return ast;
    }());
    TSCompiler.ast = ast;
})(TSCompiler || (TSCompiler = {}));
