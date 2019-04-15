/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="Tree.ts"/>
/// <reference path="symbol.ts"/>
/// <reference path="node.ts"/>
var TSCompiler;
(function (TSCompiler) {
    var SemAnalysis = /** @class */ (function () {
        function SemAnalysis() {
        }
        SemAnalysis.prototype.performSemAnalysis = function () {
            _Log_.printSAMessage("\nBeginning Semantic Analysis...\n");
            this.scopes = [];
            this.scopeName = 0;
            this.abstractSyntaxTree = new TSCompiler.Tree();
            this.buildAST(_Tree_.getRoot());
            _Log_.printASTMessage(this.abstractSyntaxTree.toStringAST());
            //_Log_.printSymbolT(this.scopes);
            _Log_.printSAMessage("Semantic Analysis complete.");
        };
        SemAnalysis.prototype.buildAST = function (root) {
            this.analyzeProgram(root);
        };
        SemAnalysis.prototype.analyzeProgram = function (node) {
            var newScope = new TSCompiler.Scope(this.scopeName);
            _Log_.printSAMessage("Created Scope " + newScope.getName() + ".");
            this.scopeName++;
            this.analyzeBlock(node.children[0], newScope);
        };
        SemAnalysis.prototype.analyzeBlock = function (cstNode, scope, astNode) {
            var newNode = new TSCompiler.Node("Block");
            // Define and Check root
            if (this.abstractSyntaxTree.getRoot() != null) {
                astNode.addChild(newNode);
                astNode = newNode;
                var newScope = new TSCompiler.Scope(this.scopeName);
                _Log_.printSAMessage("Created Scope " + newScope.getName() + ".");
                this.scopeName++;
                newScope.setParent(scope);
                this.scopes.push(newScope);
                if (cstNode.children.length > 2) {
                    this.analyzeStatementList(cstNode.children[1], astNode, newScope);
                }
            }
            else {
                this.abstractSyntaxTree.setRoot(newNode);
                astNode = newNode;
                this.scopes.push(scope);
                if (cstNode.children.length > 2) {
                    this.analyzeStatementList(cstNode.children[1], astNode, scope);
                }
            }
        };
        SemAnalysis.prototype.analyzeStatementList = function (cstNode, astNode, scope) {
            if (!cstNode) {
                return;
            }
            this.analyzeStatement(cstNode.children[0], astNode, scope);
            this.analyzeStatementList(cstNode.children[1], astNode, scope);
        };
        SemAnalysis.prototype.analyzeStatement = function (cstNode, astNode, scope) {
            switch (cstNode.children[0].getType()) {
                case "Print Statement":
                    this.analyzePrintStatement(cstNode.children[0], astNode, scope);
                    break;
                case "Assignment Statement":
                    this.analyzeAssignmentStatement(cstNode.children[0], astNode, scope);
                    break;
                case "Variable Declaration":
                    this.analyzeVariableDeclaration(cstNode.children[0], astNode, scope);
                    break;
                case "While Statement":
                    this.analyzeWhileStatement(cstNode.children[0], astNode, scope);
                    break;
                case "If Statement":
                    this.analyzeIfStatement(cstNode.children[0], astNode, scope);
                    break;
                case "Block":
                    this.analyzeBlock(cstNode.children[0], scope, astNode);
                    break;
                default:
                    _Log_.printSAError("Statement undefined.");
            }
        };
        SemAnalysis.prototype.analyzePrintStatement = function (cstNode, astNode, scope) {
            var newNode = new TSCompiler.Node("Print Statement");
            astNode.addChild(newNode);
            astNode = newNode;
            this.analyzeExpression(cstNode.children[2], astNode, scope);
        };
        SemAnalysis.prototype.analyzeAssignmentStatement = function (cstNode, astNode, scope) {
            // console.log(cstNode);
            var newNode = new TSCompiler.Node("Assignment Statement");
            var id = new TSCompiler.Node(cstNode.children[0].children[0].getValue());
            newNode.addChild(id);
            newNode.setLineNumber(cstNode.children[0].children[0].getLineNumber());
            astNode.addChild(newNode);
            astNode = newNode;
            this.analyzeExpression(cstNode.children[2], astNode, scope);
            // ID
            _Log_.printSAMessage("Checking for identifier '" + cstNode.children[0].children[0].getValue() + "' in Scope " + scope.getName() + ".");
            var scopeCheck = scope.findId(cstNode.children[0].children[0].getValue());
            if (!scopeCheck) {
                _Log_.printSAError("Identifier '" + cstNode.children[0].children[0].getValue() + "' not in scope.");
            }
            _Log_.printSAMessage("Found '" + cstNode.children[0].children[0].getValue() + "' in Scope " + scope.getName() + ".");
            // Check ID
            _Log_.printSAMessage("Checking if identifier '" + cstNode.children[0].children[0].getValue() + "' is being assigned the type it was declared.");
            var typeCheck = scope.confirmType(cstNode.children[0].children[0].getValue(), astNode.children[1]);
            if (!typeCheck) {
                _Log_.printSAError("Type mismatch. Expected " + scope.getTypeOfSymbol(cstNode.children[0].children[0].getValue()) + ".");
            }
            _Log_.printSAMessage("Identifier assigned successfully.");
        };
        SemAnalysis.prototype.analyzeVariableDeclaration = function (cstNode, astNode, scope) {
            var newNode = new TSCompiler.Node("Variable Declaration");
            //Type and Value
            var type = new TSCompiler.Node(cstNode.children[0].getValue());
            var value = new TSCompiler.Node(cstNode.children[1].children[0].getValue());
            newNode.addChild(type);
            newNode.addChild(value);
            astNode.addChild(newNode);
            var newSymbol = new TSCompiler.Symbol(cstNode.children[1].children[0].getValue(), cstNode.children[0].getValue(), cstNode.children[0].getLineNumber());
            scope.addSymbol(newSymbol);
            _Log_.printSAMessage("Item added to Symbol Table: " + newSymbol.getType() + " " + newSymbol.getName() +
                " in Scope " + scope.getName() + ".");
        };
        SemAnalysis.prototype.analyzeWhileStatement = function (cstNode, astNode, scope) {
            var newNode = new TSCompiler.Node("While Statement");
            astNode.addChild(newNode);
            astNode = newNode;
            this.analyzeBooleanExpression(cstNode.children[1], astNode, scope);
            this.analyzeBlock(cstNode.children[2], scope, astNode);
        };
        SemAnalysis.prototype.analyzeIfStatement = function (cstNode, astNode, scope) {
            var newNode = new TSCompiler.Node("If Statement");
            astNode.addChild(newNode);
            astNode = newNode;
            this.analyzeBooleanExpression(cstNode.children[1], astNode, scope);
            this.analyzeBlock(cstNode.children[2], scope, astNode);
        };
        SemAnalysis.prototype.analyzeExpression = function (cstNode, astNode, scope) {
            switch (cstNode.children[0].getType()) {
                case "Int Expression":
                    this.analyzeIntExpression(cstNode.children[0], astNode, scope);
                    break;
                case "String Expression":
                    this.analyzeStringExpression(cstNode.children[0], astNode, scope);
                    break;
                case "Boolean Expression":
                    this.analyzeBooleanExpression(cstNode.children[0], astNode, scope);
                    break;
                case "Identifier":
                    var id = new TSCompiler.Node(cstNode.children[0].children[0].getValue());
                    id.setIdentifier(true);
                    astNode.addChild(id);
                    var search = scope.findId(cstNode.children[0].children[0].getValue());
                    if (!search) {
                        _Log_.printSAError("Identifier '" + cstNode.children[0].children[0].getValue() + "' not found.");
                    }
                    break;
                default:
                    _Log_.printSAError("Undefined expression.");
                    throw new Error("Undefined expression. This shouldn't happen.");
            }
        };
        SemAnalysis.prototype.analyzeIntExpression = function (cstNode, astNode, scope) {
            if (cstNode.children.length === 1) {
                var value = new TSCompiler.Node(cstNode.children[0].getValue());
                value.setInt(true);
                astNode.addChild(value);
            }
            else {
                var value = new TSCompiler.Node(cstNode.children[0].getValue());
                value.setInt(true);
                astNode.addChild(value);
                var plus = new TSCompiler.Node("+");
                astNode.addChild(plus);
                astNode = plus;
                console.log(cstNode.children[2].children[0]);
                var typeCheck = cstNode.children[2].children[0];
                if (typeCheck.getType() === "Boolean Expression" || typeCheck.getType() === "String Expression") {
                    _Log_.printSAError("Type mismatch, expected Int Expression.");
                }
                this.analyzeExpression(cstNode.children[2], astNode, scope);
            }
        };
        SemAnalysis.prototype.analyzeStringExpression = function (cstNode, astNode, scope) {
            if (cstNode.children.length > 2) {
                this.analyzeCharList(cstNode.children[1], astNode, "", scope);
            }
            else {
                var newNode = new TSCompiler.Node("");
                astNode.addChild(newNode);
            }
        };
        SemAnalysis.prototype.analyzeBooleanExpression = function (cstNode, astNode, scope) {
            if (cstNode.children.length > 1) {
                var newNode = new TSCompiler.Node(cstNode.children[2].getValue());
                astNode.addChild(newNode);
                astNode = newNode;
                this.analyzeExpression(cstNode.children[1], astNode, scope);
                this.analyzeExpression(cstNode.children[3], astNode, scope);
            }
            else {
                var newNode = new TSCompiler.Node(cstNode.children[0].getValue());
                newNode.setBoolean(true);
                astNode.addChild(newNode);
            }
        };
        SemAnalysis.prototype.analyzeCharList = function (cstNode, astNode, string, scope) {
            if (cstNode.children.length === 1) {
                string += cstNode.children[0].getValue();
                var newNode = new TSCompiler.Node(string);
                astNode.addChild(newNode);
            }
            else {
                string += cstNode.children[0].getValue();
                this.analyzeCharList(cstNode.children[1], astNode, string, scope);
            }
        };
        return SemAnalysis;
    }());
    TSCompiler.SemAnalysis = SemAnalysis;
})(TSCompiler || (TSCompiler = {}));
