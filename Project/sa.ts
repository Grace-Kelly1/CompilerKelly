///<reference path='tree.ts' />
///<reference path='scope.ts' />
///<reference path='globals.ts' />
///<reference path='node.ts' />
///<reference path='symbol.ts' />
///<reference path='ast.ts' />
///<reference path='parse.ts' />
///<reference path='logger.ts' />
///<reference path='token.ts' />


module TSCompiler{
    export class sa{
        private scopes: Scope[];
        private scopeName: number;
        private astTree: Tree;

        public performAnalysis(){
            _Log_.printMessage("\nBeginning Semantic Analysis.\n");
            
            this.scopes = [];
            this.scopeName = 0;
            this.astTree = new Tree();
            this.build(_Tree_.getRoot());
            //_Log_.printAST(this.astTree.toStringAST());
            console.log("Trying to print scope table!!" + this.scopes.length);
            _Log_.printSymbolTable(this.scopes);
            _Log_.printMessage("Semantic Analysis complete.");
        }

        public build(root: Node) {
            this.analyzeProgram(root);
        }

        public  analyzeProgram(node: Node) {
            console.log("Analyze PRogram");
            var newScope = new Scope(this.scopeName);
            _Log_.printMessage("Created Scope " + newScope.getName() + ".");
            this.scopeName++;
            this.analyzeBlock(node.children[0], newScope);
        }

        public  analyzeBlock(cstNode: Node, scope: Scope, astNode?: Node) {
            console.log("Analyze Block");
            var newNode = new Node("Block");
            console.log(this.astTree.getRoot());

            if (this.astTree.getRoot() != null) {
                astNode.addChild(newNode);
                astNode = newNode;

                var newScope = new Scope(this.scopeName);
                _Log_.printMessage("Created Scope " + newScope.getName() + ".");
                this.scopeName++;
                newScope.setParent(scope);
                this.scopes.push(newScope);
                // Statement list is up next, if there is one
                
                    this.analyzeStatementList(cstNode.children[1], astNode, newScope)
                

            } else {
                this.astTree.setRoot(newNode);
                astNode = newNode;
                this.scopes.push(scope);
                
                    this.analyzeStatementList(cstNode.children[1], astNode, scope)
                
            }
        }

        public  analyzeStatementList(cstNode: Node, astNode: Node, scope: Scope) {
            console.log("Analyze SL");
            if (!cstNode) {
                return;
            }
            //console.log(cstNode.children[0].getType());
            this.analyzeStatement(cstNode.children[0], astNode, scope);
            this.analyzeStatementList(cstNode.children[1], astNode, scope);
        }

        public  analyzeStatement(cstNode: Node, astNode: Node, scope: Scope) {
            console.log("Analyze S");
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
            }
        }

        public  analyzePrintStatement(cstNode: Node, astNode: Node, scope: Scope) {
            console.log("Analyze Print");
            var newNode = new Node("Print Statement");
            astNode.addChild(newNode);
            astNode = newNode;
            this.analyzeExpression(cstNode.children[2], astNode, scope);
        }

        public  analyzeAssignmentStatement(cstNode: Node, astNode: Node, scope: Scope) {
            console.log("Analyze Assign");
            var newNode = new Node("Assignment Statement");
            var id = new Node(cstNode.children[0].children[0].getValue());
            newNode.addChild(id);
            newNode.setLineNumber(cstNode.children[0].children[0].getLineNumber());
            astNode.addChild(newNode);
            astNode = newNode;

            this.analyzeExpression(cstNode.children[2], astNode, scope);

            //ID exists
            _Log_.printMessage("Checking for identifier '" + cstNode.children[0].children[0].getValue() + "' in Scope " + scope.getName() + ".");
            var scopeCheck = scope.findIdentifier(cstNode.children[0].children[0].getValue());
            if (!scopeCheck) {
                _Log_.printError("Identifier '" + cstNode.children[0].children[0].getValue() + "' not in scope. " + astNode.getLineNumber() + "----Semantic Analyzer");
            }
            _Log_.printMessage("Found '" + cstNode.children[0].children[0].getValue() + "' in Scope " + scope.getName() + ".");

            // type check it
            _Log_.printMessage("Checking if identifier '" + cstNode.children[0].children[0].getValue() + "' is being assigned the type it was declared.");
            var typeCheck = scope.confirmType(cstNode.children[0].children[0].getValue(), astNode.children[1]);
            if (!typeCheck) {
                _Log_.printError("Type mismatch. Expected " + scope.getTypeOfSymbol(cstNode.children[0].children[0].getValue()) + "." + astNode.getLineNumber() + "-----Semantic Analyzer");
            }
            _Log_.printMessage("Identifier assigned successfully.");
        }

        public  analyzeVariableDeclaration(cstNode: Node, astNode: Node, scope: Scope) {
            console.log("Analyze Var");
            var newNode = new Node("Variable Declaration");

            //Add the type and value 
            var type = new Node(cstNode.children[0].getValue());
            var value = new Node(cstNode.children[1].children[0].getValue());
            newNode.addChild(type);
            newNode.addChild(value);
            astNode.addChild(newNode);

            var newSymbol = new Symbol(cstNode.children[1].children[0].getValue(), cstNode.children[0].getValue(), cstNode.children[0].getLineNumber());
            scope.addSymbol(newSymbol);
            _Log_.printMessage("Item added to Symbol Table: " + newSymbol.getType() + " " + newSymbol.getName() +" in Scope " + scope.getName() + ".")
        }

        public  analyzeWhileStatement(cstNode: Node, astNode: Node, scope: Scope) {
            console.log("Analyze while");
            var newNode = new Node("While Statement");
            astNode.addChild(newNode);
            astNode = newNode;

            this.analyzeBooleanExpression(cstNode.children[1], astNode, scope);
            this.analyzeBlock(cstNode.children[2], scope, astNode);
        }

        public  analyzeIfStatement(cstNode: Node, astNode: Node, scope: Scope) {
            console.log("Analyze IF");
            var newNode = new Node("If Statement");
            astNode.addChild(newNode);
            astNode = newNode;

            this.analyzeBooleanExpression(cstNode.children[1], astNode, scope);
            this.analyzeBlock(cstNode.children[2], scope, astNode);
        }

        public  analyzeExpression(cstNode: Node, astNode: Node, scope: Scope) {
            console.log("Analyze Expression");
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
                    var id = new Node(cstNode.children[0].children[0].getValue());
                    id.setIdentifier(true);
                    astNode.addChild(id);
                    var search = scope.findIdentifier(cstNode.children[0].children[0].getValue());
                    if (!search) {
                        _Log_.printError("Identifier '" + cstNode.children[0].children[0].getValue() + "' not found."+ cstNode.children[0].children[0].getLineNumber() + "-----Semantic Analysis");
                    }
                    break;
                default:
                    _Log_.printError("Undefined expression. " + cstNode.getLineNumber() + "-----Semantic Analyzer");
            }
        }

        public  analyzeIntExpression(cstNode: Node, astNode: Node, scope: Scope) {
            console.log("Analyze Int");
            if (cstNode.children.length === 1) {
                var value = new Node(cstNode.children[0].getValue());
                value.setInt(true);
                astNode.addChild(value);
            } else {
                
                var value = new Node(cstNode.children[0].getValue());
                value.setInt(true);
                astNode.addChild(value);

                var plus = new Node("+");
                astNode.addChild(plus);
                astNode = plus;
                console.log(cstNode.children[2].children[0]);
                var typeCheck = cstNode.children[2].children[0];
                if (typeCheck.getType() === "Boolean Expression" || typeCheck.getType() === "String Expression") {
                    _Log_.printError("Type mismatch, expected Int Expression. " + typeCheck.getLineNumber() +"------Semantic Analyzer");
                } 
                
                this.analyzeExpression(cstNode.children[2], astNode, scope);
            }
        }

        public  analyzeStringExpression(cstNode: Node, astNode: Node, scope: Scope) {
            console.log("Analyze String");
            if (cstNode.children.length > 2) {
                this.analyzeCharList(cstNode.children[1], astNode, "", scope);
            } else {
                var newNode = new Node("");
                astNode.addChild(newNode);
            }
        }

        public  analyzeBooleanExpression(cstNode: Node, astNode: Node, scope: Scope) {
            console.log("Analyze Bool");
            if (cstNode.children.length > 1) {
                var newNode = new Node(cstNode.children[2].getValue());
                astNode.addChild(newNode);
                astNode = newNode;
                this.analyzeExpression(cstNode.children[1], astNode, scope);
                this.analyzeExpression(cstNode.children[3], astNode, scope);
            } else {
                var newNode = new Node(cstNode.children[0].getValue());
                newNode.setBoolean(true);
                astNode.addChild(newNode);
            }
        }

        public  analyzeCharList(cstNode: Node, astNode: Node, string: string, scope: Scope) {
            console.log("Analyze CL");
            if (cstNode.children.length === 1) {
                string += cstNode.children[0].getValue();
                var newNode = new Node(string);
                astNode.addChild(newNode);
            } else {
                string += cstNode.children[0].getValue();
                this.analyzeCharList(cstNode.children[1], astNode, string, scope);
            }
        }
    }
}