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
        ast.prototype.Ast = function () {
            console.log('AST Inside');
            _CurrentT_ = _Tokens_[_TokenIndex_];
            //scope = -1;
            //scopeTree = new symbolTree();
            //var astCompleted = true;
            _CurrentT_ = _Tokens_[_TokenIndex_];
            //_Log_.printMessage("\nBeginning  Session...");
            _Tree_ = new TSCompiler.Tree();
            //_Tree_.addNode("Root", "brnch");
            //_Tree_ .addNode("Root", "branch");
            //_Log_.printParseMessage("PARSE - parse()");
            this.parseProgram();
            //_Log_.printParseMessage("Parse Completed");
            //_Tree_: new TSCompiler.Tree();
            //console.log(_Tree_.toString());
            // _Log_.printCSTMessage("\nCST for program" + p + "...");
            _Log_.printAST();
        };
        ast.prototype.parseProgram = function () {
            //console.log("Here");
            _Tree_.addNode("Program", "branch");
            this.parseBlock();
            this.consumeToken();
            _Tree_.kick();
            _Tree_.kick();
            // if(currentToken < ASTtokens.length){
            //     parseProgram();
            // }
        };
        ast.prototype.parseBlock = function () {
            //console.log("Here");
            // scope++;
            // scopeTree.addNode("ScopeLevel: "+scope, "branch", scope);
            _Tree_.addNode("Block", "branch");
            this.consumeToken();
            this.parseStatementL();
            this.consumeToken();
            // scopeTree.kick();
        };
        ast.prototype.parseStatementL = function () {
            if (_CurrentT_.type === PRINT.type ||
                _CurrentT_.type === ID.type ||
                _CurrentT_.type === INT.type ||
                _CurrentT_.type === BOOLEAN.type ||
                _CurrentT_.type === STRING.type ||
                _CurrentT_.type === L_BRACE.type ||
                _CurrentT_.type === WHILE.type ||
                _CurrentT_.type === IF.type) {
                this.parseStatement();
                _Tree_.kick();
                //this.parseStatementL();
            }
        };
        ast.prototype.parseStatement = function () {
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
        };
        ast.prototype.parsePrint = function () {
            _Tree_.addNode("PrintStatement", "branch");
            this.consumeToken();
            this.consumeToken();
            this.parseExper();
            this.consumeToken();
        };
        ast.prototype.parseAssign = function () {
            _Tree_.addNode("AssignmentStatement", "branch");
            this.parseID();
            this.consumeToken();
            this.parseExper();
        };
        ast.prototype.parseVar = function () {
            _Tree_.addNode("VariableDeclaration", "branch");
            this.parseType();
            this.parseID();
        };
        ast.prototype.parseWhile = function () {
            _Tree_.addNode("WhileStatement", "branch");
            this.consumeToken();
            this.parseBoolean();
            this.parseBlock();
        };
        ast.prototype.parseIf = function () {
            _Tree_.addNode("IfStatement", "branch");
            this.consumeToken();
            this.parseBoolean();
            this.parseBlock();
        };
        ast.prototype.parseExper = function () {
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
                    this.parseID();
                    break;
                default:
                    _Log_.printParseError("Expected to finish assigning variable");
            }
        };
        ast.prototype.parseInt = function () {
            if (_CurrentT_.type === DIGIT.type) {
                this.match(_CurrentT_.type, DIGIT.type);
                if (_CurrentT_.type === PLUS.type) {
                    this.match(_CurrentT_.type, PLUS.type);
                    _Tree_.addNode("Add", "branch");
                    this.parseDigit();
                    this.parseIntOp();
                    this.parseExper();
                    _Tree_.kick();
                }
                else {
                    this.parseDigit();
                }
            }
        };
        ast.prototype.parseString = function () {
            this.consumeToken();
            this.parseCharList();
            this.consumeToken();
        };
        ast.prototype.parseBoolean = function () {
            if (this.match(_CurrentT_.type, L_PAREN.type)) {
                this.consumeToken();
                _Tree_.addNode("Comp", "branch");
                this.parseExper();
                // var branchType = parseBoolOp();
                // _Tree_.cur.name = branchType;
                // _Tree_.cur.type = branchType;
                this.parseExper();
                this.consumeToken();
            }
            else if (this.match(_CurrentT_.type, BOOLEAN.type)) {
                this.parseBoolVal();
            }
            _Tree_.kick();
        };
        ast.prototype.parseID = function () {
            _Tree_.addNode(_CurrentT_, "leaf");
            this.consumeToken();
        };
        ast.prototype.parseCharList = function () {
            var tempString = "";
            while (this.match(_CurrentT_.type, CHAR.type)) {
                tempString = tempString + _CurrentT_;
                this.consumeToken();
            }
            _Tree_.addNode(tempString, "leaf");
        };
        ast.prototype.parseType = function () {
            _Tree_.addNode(_CurrentT_, "leaf");
            this.consumeToken();
        };
        ast.prototype.parseChar = function () {
            _Tree_.addNode(_CurrentT_, "leaf");
            this.consumeToken();
            this.parseCharList();
        };
        ast.prototype.parseDigit = function () {
            _Tree_.addNode(_CurrentT_, "leaf");
            this.consumeToken();
        };
        ast.prototype.parseBool = function () {
            //branchType = "";
            if (this.match(_CurrentT_.type, "T_EQUALITY")) {
                this.consumeToken();
                //branchType = "Equality";
            }
            else if (this.match(_CurrentT_.type, "T_INEQUALITY")) {
                this.consumeToken();
                //branchType = "Inequality";
            }
            //return branchType;
        };
        ast.prototype.parseBoolVal = function () {
            _Tree_.addNode(_CurrentT_, "leaf");
            this.consumeToken();
        };
        ast.prototype.parseIntOp = function () {
            this.consumeToken();
        };
        ast.prototype.match = function (tokenKind, expectedKind) {
            var match;
            if (tokenKind == expectedKind) {
                match = true;
            }
            else {
                match = false;
            }
            return match;
        };
        ast.prototype.consumeToken = function () {
            _CurrentT_ = _Tokens_[_TokenIndex_ + 1];
        };
        return ast;
    }());
    TSCompiler.ast = ast;
})(TSCompiler || (TSCompiler = {}));
