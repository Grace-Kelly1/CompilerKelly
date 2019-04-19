///<reference path='Tree.ts' />
///<reference path='scope.ts' />
///<reference path='globals.ts' />
///<reference path='node.ts' />
///<reference path='symbol.ts' />
///<reference path='ast.ts' />
///<reference path='parse.ts' />
///<reference path='logger.ts' />
///<reference path='token.ts' />
var TSCompiler;
(function (TSCompiler) {
    var sa = /** @class */ (function () {
        function sa() {
        }
        sa.prototype.performAnalysis = function () {
            _Log_.printMessage("\nBeginning Semantic Analysis.");
            this.scopes = [];
            this.scopeName = 0;
            this.astTree = new TSCompiler.Tree();
            this.build(_Tree_.getRoot());
            _Log_.printAST(this.astTree.toStringAST());
            console.log("Trying to print scope table!!" + this.scopes.length);
            _Log_.printSymbolTable(this.scopes);
            _Log_.printMessage("Semantic Analysis complete.");
        };
        sa.prototype.build = function (root) {
            this.analyzeProgram(root);
        };
        sa.prototype.analyzeProgram = function (node) {
            console.log("Analyze PRogram");
            var newScope = new TSCompiler.Scope(this.scopeName);
            _Log_.printMessage("Created Scope " + newScope.getName() + ".");
            this.scopeName++;
            this.analyzeBlock(node.children[0], newScope);
        };
        sa.prototype.analyzeBlock = function (cstNode, scope, astNode) {
            console.log("Analyze Block");
            var newNode = new TSCompiler.Node("Block");
            console.log(this.astTree.getRoot());
            if (this.astTree.getRoot() != null) {
                astNode.addChild(newNode);
                astNode = newNode;
                var newScope = new TSCompiler.Scope(this.scopeName);
                _Log_.printMessage("Created Scope " + newScope.getName() + ".");
                this.scopeName++;
                newScope.setParent(scope);
                this.scopes.push(newScope);
                // Statement list is up next, if there is one
                this.analyzeStatementList(cstNode.children[1], astNode, newScope);
            }
            else {
                this.astTree.setRoot(newNode);
                astNode = newNode;
                this.scopes.push(scope);
                this.analyzeStatementList(cstNode.children[1], astNode, scope);
            }
        };
        sa.prototype.analyzeStatementList = function (cstNode, astNode, scope) {
            console.log("Analyze SL");
            if (!cstNode) {
                return;
            }
            //undefined??? how to fix this?
            console.log(cstNode);
            this.analyzeStatement(cstNode.children[0], astNode, scope);
            this.analyzeStatementList(cstNode.children[1], astNode, scope);
        };
        sa.prototype.analyzeStatement = function (cstNode, astNode, scope) {
            console.log("Analyze S");
            switch (cstNode.children[0].getType()) {
                case "PrintStatement":
                    this.analyzePrintStatement(cstNode.children[0], astNode, scope);
                    break;
                case "AssignmentStatement":
                    this.analyzeAssignmentStatement(cstNode.children[0], astNode, scope);
                    break;
                case "VariableDeclaration":
                    this.analyzeVariableDeclaration(cstNode.children[0], astNode, scope);
                    break;
                case "WhileStatement":
                    this.analyzeWhileStatement(cstNode.children[0], astNode, scope);
                    break;
                case "IfStatement":
                    this.analyzeIfStatement(cstNode.children[0], astNode, scope);
                    break;
                case "Block":
                    this.analyzeBlock(cstNode.children[0], scope, astNode);
                    break;
                default:
                    _Log_.printError("Statement undefined. " + cstNode.getLineNumber());
            }
        };
        sa.prototype.analyzePrintStatement = function (cstNode, astNode, scope) {
            console.log("Analyze Print");
            var newNode = new TSCompiler.Node("Print Statement");
            astNode.addChild(newNode);
            astNode = newNode;
            this.analyzeExpression(cstNode.children[2], astNode, scope);
        };
        sa.prototype.analyzeAssignmentStatement = function (cstNode, astNode, scope) {
            console.log("Analyze Assign");
            var newNode = new TSCompiler.Node("Assignment Statement");
            var id = new TSCompiler.Node(cstNode.children[0].children[0].getValue());
            newNode.addChild(id);
            newNode.setLineNumber(cstNode.children[0].children[0].getLineNumber());
            astNode.addChild(newNode);
            astNode = newNode;
            this.analyzeExpression(cstNode.children[2], astNode, scope);
            //ID exists
            _Log_.printMessage("Checking for identifier '" + cstNode.children[0].children[0].getValue() + "' in Scope " + scope.getName() + ".");
            var scopeCheck = scope.findIdentifier(cstNode.children[0].children[0].getValue());
            if (!scopeCheck) {
                _Log_.printError("Identifier '" + cstNode.children[0].children[0].getValue() + "' not in scope. " + astNode.getLineNumber());
            }
            _Log_.printMessage("Found '" + cstNode.children[0].children[0].getValue() + "' in Scope " + scope.getName() + ".");
            // type check it
            _Log_.printMessage("Checking if identifier '" + cstNode.children[0].children[0].getValue() + "' is being assigned the type it was declared.");
            var typeCheck = scope.confirmType(cstNode.children[0].children[0].getValue(), astNode.children[1]);
            if (!typeCheck) {
                _Log_.printError("Type mismatch. Expected " + scope.getTypeOfSymbol(cstNode.children[0].children[0].getValue()) + "." + astNode.getLineNumber());
            }
            _Log_.printMessage("Identifier assigned successfully.");
        };
        sa.prototype.analyzeVariableDeclaration = function (cstNode, astNode, scope) {
            console.log("Analyze Var");
            var newNode = new TSCompiler.Node("Variable Declaration");
            //Add the type and value 
            var type = new TSCompiler.Node(cstNode.children[0].getValue());
            var value = new TSCompiler.Node(cstNode.children[1].children[0].getValue());
            newNode.addChild(type);
            newNode.addChild(value);
            astNode.addChild(newNode);
            var newSymbol = new TSCompiler.Symbol(cstNode.children[1].children[0].getValue(), cstNode.children[0].getValue(), cstNode.children[0].getLineNumber());
            scope.addSymbol(newSymbol);
            _Log_.printMessage("Item added to Symbol Table: " + newSymbol.getType() + " " + newSymbol.getName() + " in Scope " + scope.getName() + ".");
        };
        sa.prototype.analyzeWhileStatement = function (cstNode, astNode, scope) {
            console.log("Analyze while");
            var newNode = new TSCompiler.Node("While Statement");
            astNode.addChild(newNode);
            astNode = newNode;
            this.analyzeBooleanExpression(cstNode.children[1], astNode, scope);
            this.analyzeBlock(cstNode.children[2], scope, astNode);
        };
        sa.prototype.analyzeIfStatement = function (cstNode, astNode, scope) {
            console.log("Analyze IF");
            var newNode = new TSCompiler.Node("If Statement");
            astNode.addChild(newNode);
            astNode = newNode;
            this.analyzeBooleanExpression(cstNode.children[1], astNode, scope);
            this.analyzeBlock(cstNode.children[2], scope, astNode);
        };
        sa.prototype.analyzeExpression = function (cstNode, astNode, scope) {
            console.log("Analyze Expression");
            switch (cstNode.children[0].getType()) {
                case "IntExpr":
                    this.analyzeIntExpression(cstNode.children[0], astNode, scope);
                    break;
                case "StringExpr":
                    this.analyzeStringExpression(cstNode.children[0], astNode, scope);
                    break;
                case "BooleanExpr":
                    this.analyzeBooleanExpression(cstNode.children[0], astNode, scope);
                    break;
                case "Id":
                    // console.log("Got Here");
                    var id = new TSCompiler.Node(cstNode.children[0].children[0].getValue());
                    id.setIdentifier(true);
                    astNode.addChild(id);
                    var search = scope.findIdentifier(cstNode.children[0].children[0].getValue());
                    if (!search) {
                        _Log_.printError("Identifier '" + cstNode.children[0].children[0].getValue() + "' not found." + cstNode.children[0].children[0].getLineNumber());
                    }
                    break;
                default:
                    console.log("Got Here");
                    _Log_.printError("Undefined expression. " + cstNode.getLineNumber());
            }
        };
        sa.prototype.analyzeIntExpression = function (cstNode, astNode, scope) {
            console.log("Analyze Int");
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
                    _Log_.printError("Type mismatch, expected Int Expression. " + typeCheck.getLineNumber());
                }
                this.analyzeExpression(cstNode.children[2], astNode, scope);
            }
        };
        sa.prototype.analyzeStringExpression = function (cstNode, astNode, scope) {
            console.log("Analyze String");
            if (cstNode.children.length > 2) {
                this.analyzeCharList(cstNode.children[1], astNode, "", scope);
            }
            else {
                var newNode = new TSCompiler.Node("");
                astNode.addChild(newNode);
            }
        };
        sa.prototype.analyzeBooleanExpression = function (cstNode, astNode, scope) {
            console.log("Analyze Bool");
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
        sa.prototype.analyzeCharList = function (cstNode, astNode, string, scope) {
            console.log("Analyze CL");
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
