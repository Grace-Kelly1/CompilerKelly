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
        ast.prototype.ast = function () {
            var currentToken = 0;
            var scope = -1;
            var scopeTree = new TSCompiler.symbolTree();
            var astCompleted = true;
            _CurrentT_ = _Tokens_[_TokenIndex_];
            //_Log_.printMessage("\nBeginning  Session...");
            var _AST_ = new TSCompiler.Tree();
            _AST_.addNode("Root", "brnch");
            //_Tree_ .addNode("Root", "branch");
            //_Log_.printParseMessage("PARSE - parse()");
            parseProgram();
            //_Log_.printParseMessage("Parse Completed");
            if (astCompleted === true) {
                //_Tree_: new TSCompiler.Tree();
                //console.log(_Tree_.toString());
                // _Log_.printCSTMessage("\nCST for program" + p + "...");
                _Log_.printAST();
            }
            function parseProgram() {
                _AST_.addNode("Program", "branch");
                parseBlock();
                consumeToken();
                _AST_.kick();
                _AST_.kick();
                // if(currentToken < ASTtokens.length){
                //     parseProgram();
                // }
            }
            function parseBlock() {
                scope++;
                scopeTree.addNode("ScopeLevel: " + scope, "branch", scope);
                _AST_.addNode("Block", "branch");
                consumeToken();
                parseStatementL();
                consumeToken();
                scopeTree.kick();
            }
            function parseStatementL() {
                if (_CurrentT_.type === PRINT.type ||
                    _CurrentT_.type === ID.type ||
                    _CurrentT_.type === INT.type ||
                    _CurrentT_.type === BOOLEAN.type ||
                    _CurrentT_.type === STRING.type ||
                    _CurrentT_.type === L_BRACE.type ||
                    _CurrentT_.type === WHILE.type ||
                    _CurrentT_.type === IF.type) {
                    parseStatement();
                    _AST_.kick();
                    parseStatementL();
                }
            }
            function parseStatement() {
                switch (_CurrentT_.type) {
                    case PRINT.type:
                        parsePrint();
                        break;
                    case ID.type:
                        parseAssign();
                        break;
                    case STRING.type:
                    case INT.type:
                    case BOOLEAN.type:
                        parseVar();
                        break;
                    case WHILE.type:
                        parseWhile();
                        break;
                    case IF.type:
                        parseIf();
                        break;
                    default:
                        parseBlock();
                }
            }
            function parsePrint() {
                _AST_.addNode("PrintStatement", "branch");
                consumeToken();
                consumeToken();
                parseExper();
                consumeToken();
            }
            function parseAssign() {
                _AST_.addNode("AssignmentStatement", "branch");
                parseID();
                consumeToken();
                parseExper();
            }
            function parseVar() {
                _AST_.addNode("VariableDeclaration", "branch");
                parseType();
                parseID();
            }
            function parseWhile() {
                _AST_.addNode("WhileStatement", "branch");
                consumeToken();
                parseBoolean();
                parseBlock();
            }
            function parseIf() {
                _AST_.addNode("IfStatement", "branch");
                consumeToken();
                parseBoolean();
                parseBlock();
            }
            function parseExper() {
                switch (_CurrentT_.type) {
                    // IntExpr
                    case DIGIT.type:
                        parseInt();
                        break;
                    // String
                    case QUOTE.type:
                        parseString();
                        break;
                    // Boolean
                    case L_PAREN.type:
                    case TRUE.type:
                    case FALSE.type:
                        parseBoolean();
                        break;
                    // ID
                    case ID.type:
                        this.parseId();
                        break;
                    default:
                        _Log_.printParseError("Expected to finish assigning variable");
                }
            }
            function parseInt() {
                if (_CurrentT_.type === DIGIT.type) {
                    this.matchParse(DIGIT.type);
                    if (_CurrentT_.type === PLUS.type) {
                        this.matchParse(PLUS.type);
                        _AST_.addNode("Add", "branch");
                        parseDigit();
                        parseIntOp();
                        parseExper();
                        _AST_.kick();
                    }
                    else {
                        parseDigit();
                    }
                }
            }
            function parseString() {
                consumeToken();
                parseCharList();
                consumeToken();
            }
            function parseBoolean() {
                if (match(_CurrentT_.type, L_PAREN.type)) {
                    consumeToken();
                    _AST_.addNode("Comp", "branch");
                    parseExper();
                    // var branchType = parseBoolOp();
                    // _AST_.cur.name = branchType;
                    // _AST_.cur.type = branchType;
                    parseExper();
                    consumeToken();
                }
                else if (match(_CurrentT_.type, BOOLEAN.type)) {
                    parseBoolVal();
                }
                _AST_.kick();
            }
            function parseID() {
                _AST_.addNode(_CurrentT_, "leaf");
                consumeToken();
            }
            function parseCharList() {
                var tempString = "";
                while (match(_CurrentT_.type, CHAR.type)) {
                    tempString = tempString + _CurrentT_;
                    consumeToken();
                }
                _AST_.addNode(tempString, "leaf");
            }
            function parseType() {
                _AST_.addNode(_CurrentT_, "leaf");
                consumeToken();
            }
            function parseChar() {
                _AST_.addNode(_CurrentT_, "leaf");
                consumeToken();
                parseCharList();
            }
            function parseDigit() {
                _AST_.addNode(_CurrentT_, "leaf");
                consumeToken();
            }
            function parseBool() {
                //branchType = "";
                if (match(_CurrentT_.type, "T_EQUALITY")) {
                    consumeToken();
                    //branchType = "Equality";
                }
                else if (match(_CurrentT_.type, "T_INEQUALITY")) {
                    consumeToken();
                    //branchType = "Inequality";
                }
                //return branchType;
            }
            function parseBoolVal() {
                _AST_.addNode(_CurrentT_, "leaf");
                consumeToken();
            }
            function parseIntOp() {
                consumeToken();
            }
            function match(tokenKind, expectedKind) {
                var match;
                if (tokenKind == expectedKind) {
                    match = true;
                }
                else {
                    match = false;
                }
                return match;
            }
            function consumeToken() {
                currentToken = currentToken + 1;
            }
        };
        return ast;
    }());
    TSCompiler.ast = ast;
})(TSCompiler || (TSCompiler = {}));
