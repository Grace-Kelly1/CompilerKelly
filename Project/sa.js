///<reference path='tree.ts' />
///<reference path='scope.ts' />
///<reference path='globals.ts' />
///<reference path='node.ts' />
///<reference path='symbol.ts' />
var TSCompiler;
(function (TSCompiler) {
    var sa = /** @class */ (function () {
        function sa() {
        }
        sa.prototype.performAnalysis = function () {
            _Log_.printMessage("\nBeginning Semantic Analysis.\n");
            this.scopes = [];
            this.scopeName = 0;
            this.abstractSyntaxTree = new TSCompiler.Tree();
            this.buildAST(_Tree_.getRoot());
            _Log_.printSymbolTable(this.scopes);
            _Log_.printMessage("Semantic Analysis complete.");
        };
        sa.prototype.buildAST = function (root) {
            this.analyzeProgram(root);
        };
        sa.prototype.analyzeProgram = function (node) {
            // Only one thing to do here
            var newScope = new TSCompiler.Scope(this.scopeName);
            _Log_.printMessage("Created Scope " + newScope.getName() + ".");
            this.scopeName++;
            this.analyzeBlock(node.children[0], newScope);
        };
        sa.prototype.analyzeBlock = function (cstNode, scope, astNode) {
            var newNode = new TSCompiler.Node("Block");
            // We have to define the root of the AST the first time,
            // so we'll check if its been set
            if (this.abstractSyntaxTree.getRoot() != null) {
                astNode.addChild(newNode);
                astNode = newNode;
                var newScope = new TSCompiler.Scope(this.scopeName);
                _Log_.printMessage("Created Scope " + newScope.getName() + ".");
                this.scopeName++;
                newScope.setParent(scope);
                this.scopes.push(newScope);
                // Statement list is up next, if there is one
                if (cstNode.children.length > 2) {
                    this.analyzeStatementList(cstNode.children[1], astNode, newScope);
                }
            }
            else {
                this.abstractSyntaxTree.setRoot(newNode);
                astNode = newNode;
                this.scopes.push(scope);
                // Statement list is up next, if there is one
                if (cstNode.children.length > 2) {
                    this.analyzeStatementList(cstNode.children[1], astNode, scope);
                }
            }
        };
        sa.prototype.analyzeStatementList = function (cstNode, astNode, scope) {
            // Handle the epsilon production
            if (!cstNode) {
                return;
            }
            this.analyzeStatement(cstNode.children[0], astNode, scope);
            this.analyzeStatementList(cstNode.children[1], astNode, scope);
        };
        sa.prototype.analyzeStatement = function (cstNode, astNode, scope) {
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
                    _Log_.printError("Statement undefined. " + cstNode.getLineNumber() + "----Semantic Analyzer");
                    throw new Error("Undefined statement passed to analyzeStatement(). This shouldn't happen.");
            }
        };
        sa.prototype.analyzePrintStatement = function (cstNode, astNode, scope) {
            var newNode = new TSCompiler.Node("Print Statement");
            astNode.addChild(newNode);
            astNode = newNode;
            this.analyzeExpression(cstNode.children[2], astNode, scope);
        };
        sa.prototype.analyzeAssignmentStatement = function (cstNode, astNode, scope) {
            // console.log(cstNode);
            var newNode = new TSCompiler.Node("Assignment Statement");
            // Add the identifier to the AST
            var id = new TSCompiler.Node(cstNode.children[0].children[0].getValue());
            newNode.addChild(id);
            newNode.setLineNumber(cstNode.children[0].children[0].getLineNumber());
            astNode.addChild(newNode);
            astNode = newNode;
            this.analyzeExpression(cstNode.children[2], astNode, scope);
            // First, make sure the ID exists
            _Log_.printMessage("Checking for identifier '" + cstNode.children[0].children[0].getValue() + "' in Scope " + scope.getName() + ".");
            var scopeCheck = scope.findIdentifier(cstNode.children[0].children[0].getValue());
            if (!scopeCheck) {
                _Log_.printError("Identifier '" + cstNode.children[0].children[0].getValue() + "' not in scope. " + astNode.getLineNumber() + "----Semantic Analyzer");
                throw new Error("ID not in scope, breaking.");
            }
            _Log_.printMessage("Found '" + cstNode.children[0].children[0].getValue() + "' in Scope " + scope.getName() + ".");
            // Then, type check it
            _Log_.printMessage("Checking if identifier '" + cstNode.children[0].children[0].getValue() + "' is being assigned the type it was declared.");
            var typeCheck = scope.confirmType(cstNode.children[0].children[0].getValue(), astNode.children[1]);
            if (!typeCheck) {
                _Log_.printError("Type mismatch. Expected " + scope.getTypeOfSymbol(cstNode.children[0].children[0].getValue()) + "." + astNode.getLineNumber() + "-----Semantic Analyzer");
                throw new Error("Type mismatch, breaking.");
            }
            _Log_.printMessage("Identifier assigned successfully.");
        };
        sa.prototype.analyzeVariableDeclaration = function (cstNode, astNode, scope) {
            var newNode = new TSCompiler.Node("Variable Declaration");
            // Add the type and value of the variable to the AST
            var type = new TSCompiler.Node(cstNode.children[0].getValue());
            var value = new TSCompiler.Node(cstNode.children[1].children[0].getValue());
            newNode.addChild(type);
            newNode.addChild(value);
            astNode.addChild(newNode);
            var newSymbol = new TSCompiler.Symbol(cstNode.children[1].children[0].getValue(), cstNode.children[0].getValue(), cstNode.children[0].getLineNumber());
            scope.addSymbol(newSymbol);
            _Log_.printMessage("Item added to Symbol Table: " + newSymbol.getType() + " " + newSymbol.getName() +
                " in Scope " + scope.getName() + ".");
        };
        sa.prototype.analyzeWhileStatement = function (cstNode, astNode, scope) {
            var newNode = new TSCompiler.Node("While Statement");
            astNode.addChild(newNode);
            astNode = newNode;
            this.analyzeBooleanExpression(cstNode.children[1], astNode, scope);
            this.analyzeBlock(cstNode.children[2], scope, astNode);
        };
        sa.prototype.analyzeIfStatement = function (cstNode, astNode, scope) {
            var newNode = new TSCompiler.Node("If Statement");
            astNode.addChild(newNode);
            astNode = newNode;
            this.analyzeBooleanExpression(cstNode.children[1], astNode, scope);
            this.analyzeBlock(cstNode.children[2], scope, astNode);
        };
        sa.prototype.analyzeExpression = function (cstNode, astNode, scope) {
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
                    var search = scope.findIdentifier(cstNode.children[0].children[0].getValue());
                    if (!search) {
                        _Log_.printError("Identifier '" + cstNode.children[0].children[0].getValue() + "' not found." + cstNode.children[0].children[0].getLineNumber() + "-----Semantic Analysis");
                        throw new Error("ID not found.");
                    }
                    break;
                default:
                    _Log_.printError("Undefined expression. " + cstNode.getLineNumber() + "-----Semantic Analyzer");
                    throw new Error("Undefined expression. This shouldn't happen.");
            }
        };
        sa.prototype.analyzeIntExpression = function (cstNode, astNode, scope) {
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
                // So the grammar says it can be an expression, but thats not exactly true
                // It can be an Identifier or an Int Expression
                // So if we check which it is, and call the appropriate function, we'll
                // fix the bug
                var typeCheck = cstNode.children[2].children[0];
                if (typeCheck.getType() === "Boolean Expression" || typeCheck.getType() === "String Expression") {
                    _Log_.printError("Type mismatch, expected Int Expression. " + typeCheck.getLineNumber() + "------Semantic Analyzer");
                    throw new Error("Type mismatch.");
                }
                this.analyzeExpression(cstNode.children[2], astNode, scope);
            }
        };
        sa.prototype.analyzeStringExpression = function (cstNode, astNode, scope) {
            if (cstNode.children.length > 2) {
                this.analyzeCharList(cstNode.children[1], astNode, "", scope);
            }
            else {
                var newNode = new TSCompiler.Node("");
                astNode.addChild(newNode);
            }
        };
        sa.prototype.analyzeBooleanExpression = function (cstNode, astNode, scope) {
            if (cstNode.children.length > 1) {
                // The next node is going to be the boolop
                var newNode = new TSCompiler.Node(cstNode.children[2].getValue());
                astNode.addChild(newNode);
                astNode = newNode;
                // then we need to evaluate the expressions on both sides of it
                this.analyzeExpression(cstNode.children[1], astNode, scope);
                this.analyzeExpression(cstNode.children[3], astNode, scope);
            }
            else {
                var newNode = new TSCompiler.Node(cstNode.children[0].getValue());
                newNode.setBoolean(true);
                astNode.addChild(newNode);
            }
        };
        sa.prototype.analyzeCharList = function (cstNode, astNode, string, scope) {
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
        return sa;
    }());
    TSCompiler.sa = sa;
})(TSCompiler || (TSCompiler = {}));
