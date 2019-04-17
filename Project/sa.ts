/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="Tree.ts"/>
/// <reference path="symbol.ts"/>
/// <reference path="node.ts"/>


module TSCompiler{
    export class SemAnalysis{
        public SA(){
            var parseCompleted = true;
            _TokenIndex_ = 0;
            _CurrentT_ = _Tokens_[_TokenIndex_];
            //console.log(_CurrentT_.type);
            
            _Log_.printMessage("\nBeginning Semantic Analysis Session...");
            
            _SymbolTree_ = new symbolTree();
            //_SymbolTree_ .addNode("Root", "branch");
            this.parseProgram();
            checkInit(_SymbolTree_.root);
            checkUsed(_SymbolTree_.root);
            _Log_.printMessage("\nSemantic Analysis Session Finished.");

        }

        public parseProgram(){
            this.parseBlock();
            //console.log("this = " + this);
            //this.matchParse(EOP.type);
            _SymbolTree_.kick();
            _SymbolTree_ .kick();
        }

        public parseBlock(){
            _SymbolTree_ .addNode();
            this.matchParse(L_BRACE.type);
            //_SymbolTree_.addNode("{", "leaf");
            this.parseStatmentL();
            //_SymbolTree_.kick();
            //_SymbolTree_.addNode("StatementList", "")
            this.matchParse(R_BRACE.type);
            //_SymbolTree_.addNode("}", "leaf");
            _SymbolTree_ .kick();
        }

        public parseStatmentL(){
            //_SymbolTree_ .addNode("StatementList", "branch");
            if (_CurrentT_.type === PRINT.type ||
                _CurrentT_.type === ID.type ||
                _CurrentT_.type === INT.type ||
                _CurrentT_.type === BOOLEAN.type ||
                _CurrentT_.type === STRING.type ||
                _CurrentT_.type === L_BRACE.type ||
                _CurrentT_.type === WHILE.type ||
                _CurrentT_.type === IF.type
            ) {
                this.parseStatments();
                //this.parseStatmentL();
                _SymbolTree_ .kick();
            }
        }

        public  parseStatments(){
            switch (_CurrentT_.type) {
                case PRINT.type:
                    this.parsePrint( );
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
            _SymbolTree_ .kick();
        }

        public parseVar(){
            _SymbolTree_ .addNode();
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
            _SymbolTree_ .kick();
        }

        public parsePrint(){
            this.matchParse(PRINT.type);
            this.matchParse(L_PAREN.type);
            this.parseExpr();
            this.matchParse(R_PAREN.type);
            _SymbolTree_ .kick();

        }

        public parseAssign(){
            this.parseId();
            this.matchParse(ASSIGN.type);
            this.parseExpr();
            _SymbolTree_ .kick();
        }

        public parseWhile(){
            _SymbolTree_ .addNode("WhileStatement", "branch");
            this.matchParse(WHILE.type);
            this.parseBoolean();
            this.parseBlock();
            _SymbolTree_ .kick();
        }

        public parseIf(){
            _SymbolTree_ .addNode("IfStatement", "branch");
            this.matchParse(IF.type);
            this.parseBoolean();
            this.parseBlock();
            _SymbolTree_ .kick();
        }

        public parseExpr(){
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
            _SymbolTree_ .kick();
        }

        public parseInt(){
            _SymbolTree_.addNode(_CurrentT_.value, "branch");
            //console.log(_CurrentT_.value);
            if (_CurrentT_.type === DIGIT.type) {
                //_SymbolTree_.addNode(_CurrentT_.value, "leaf");
                this.matchParse(DIGIT.type);
                _SymbolTree_.addNode(_CurrentT_.value, "leaf");
                if (_CurrentT_.type === PLUS.type) {
                    this.matchParse(PLUS.type);
                    this.parseExpr();
                }
            }
            _SymbolTree_ .kick();
        }

        public parseString(){
            _SymbolTree_.addNode(_CurrentT_.value, "branch");
            this.matchParse(QUOTE.type);
            this.parseChar();
            this.matchParse(QUOTE.type);
            _SymbolTree_ .kick();
        }

        public parseBoolean(){
            if (_CurrentT_.type === TRUE.type) {
                _SymbolTree_.addNode(_CurrentT_.value, "leaf");
                this.matchParse(TRUE.type);
            } else if (_CurrentT_.type === FALSE.type) {
                 _SymbolTree_.addNode(_CurrentT_.value, "leaf");
                 this.matchParse(FALSE.type);
            } else {
                this.matchParse(L_PAREN.type);
                this.parseExpr();
                if (_CurrentT_.type === EQUAL.type) {
                    this.matchParse(EQUAL.type);
                    this.parseExpr();
                    this.matchParse(R_PAREN.type);
                } else if (_CurrentT_.type === N_EQUAL.type) {
                    this.matchParse(N_EQUAL.type);
                    this.parseExpr();
                    this.matchParse(R_PAREN.type);
                }
            }
            _SymbolTree_ .kick();
        }

        public parseId(){
            //_SymbolTree_.addNode(_CurrentT_.type, "leaf");
            this.matchParse(ID.type);
            _SymbolTree_ .kick();
        }

        public parseChar(){
            if (_CurrentT_.type === SPACE.type) 
            {
                this.matchParse(SPACE.type);
                this.parseChar();
                _SymbolTree_ .kick();
            } 
            else(_CurrentT_.type === CHAR.type) 
            {
                //_SymbolTree_.addNode(_CurrentT_.value, "leaf");
                this.matchParse(CHAR.type);
                // if(_CurrentT_.type === QUOTE.type){
                //     this.parseString();
                // }
                // else{
                this.parseChar();
                // }
                _SymbolTree_ .kick();
            }
        }

        public matchParse(type){
            if(_CurrentT_.value === "{" ||
            _CurrentT_.value === "}"||
            _CurrentT_.value === "(" ||
            _CurrentT_.value === ")" ||
            _CurrentT_.value === "print"||
            _CurrentT_.value === "while" ||
            _CurrentT_.value === "if" ||
            _CurrentT_.value === "="||
            _CurrentT_.value === "==" ||
            _CurrentT_.value === "!=" ||
            _CurrentT_.value === '"' ||
            _CurrentT_.value === "+"){
                console.log("NO {");
            }

            else if (_CurrentT_.type === type) {
                console.log(_CurrentT_.value);
                    
                    _SymbolTree_.addNode(_CurrentT_.value, "leaf");
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
        }

        function checkUsed(node) {
            for(var symbol = 0; symbol < node.symbols.length; symbol++) {
                if(node.symbols[symbol].initialized == true && node.symbols[symbol].utilized == false) {
                    saWarningCount++;
                    printUnusedWarningMessage(node.symbols[symbol].key,node.symbols[symbol].line,node.symbols[symbol].col);
                }
            }
            if(node.children.length != 0) {
                node.children.forEach(function(child) {
                    checkUsed(child);
                });
            }
        }
        function checkInit(node) {
            for(var symbol = 0; symbol < node.symbols.length; symbol++) {
                if(node.symbols[symbol].initialized == false) {
                    saWarningCount++;
                    printUninitWarningMessage(node.symbols[symbol].key,node.symbols[symbol].line,node.symbols[symbol].col);
                }
            }
            if(node.children.length != 0) {
                node.children.forEach(function(child) {
                    checkInit(child);
                });
            }
        }
        function checkVarDeclared(node,usage) {
            if((node.parent != undefined || node.parent != null) && node.symbols.length > 0) {
                for(var symbol = 0; symbol < node.symbols.length; symbol++) {
                    if(node.symbols[symbol].getKey() == SAtokens[currentToken-1].value) {
                        if(verbose){
                            printSADeclaredMessage(SAtokens[currentToken-1].value);
                        }
                        break
                    } else if(symbol == node.symbols.length-1 && (node.parent != undefined || node.parent != null)) {
                        checkVarDeclared(node.parent,usage);
                        break;
                    }
                }
            } else if(node.parent != undefined || node.parent != null) {
                checkVarDeclared(node.parent,usage);
            } else {
                throwSAUndeclaredError(SAtokens[currentToken-1].value,usage);
            }
        }
        function checkVarType(node,usage) {
            if((node.parent != undefined || node.parent != null) && node.symbols.length > 0) {
                for(var symbol = 0; symbol < node.symbols.length; symbol++) {
                    if(node.symbols[symbol].getKey() == SAtokens[currentToken-1].value) {
                        checkedType = node.symbols[symbol].getType();
                        if(verbose){
                            printSAVarTypeMessage(SAtokens[currentToken-1].value, checkedType);
                        }
                        break
                    } else if(symbol == node.symbols.length-1 && (node.parent != undefined || node.parent != null)) {
                        checkVarType(node.parent,usage);
                        break;
                    }
                }
            } else if(node.parent != undefined || node.parent != null) {
                checkVarType(node.parent,usage);
            }
        }
        function declareUsed(node) {
            if((node.parent != undefined || node.parent != null) && node.symbols.length > 0) {
                for(var symbol = 0; symbol < node.symbols.length; symbol++) {
                    if(node.symbols[symbol].getKey() == SAtokens[currentToken-1].value) {
                        node.symbols[symbol].utilized = true;
                        if(verbose){
                            printSAUsedMessage(SAtokens[currentToken-1].value);
                        }
                        break
                    } else if(symbol == node.symbols.length-1 && (node.parent != undefined || node.parent != null)) {
                        declareUsed(node.parent);
                        break;
                    }
                }
            } else if(node.parent != undefined || node.parent != null) {
                declareUsed(node.parent);
            }
        }
        function declareInit(node) {
            if((node.parent != undefined || node.parent != null) && node.symbols.length > 0) {
                for(var symbol = 0; symbol < node.symbols.length; symbol++) {
                    if(node.symbols[symbol].getKey() == SAtokens[currentToken-1].value) {
                        node.symbols[symbol].initialized = true;
                        if(verbose){
                            printSAUsedMessage(SAtokens[currentToken-1].value);
                        }
                        break
                    } else if(symbol == node.symbols.length-1 && (node.parent != undefined || node.parent != null)) {
                        declareInit(node.parent);
                        break;
                    }
                }
            } else if(node.parent != undefined || node.parent != null) {
                declareInit(node.parent);
            }
        }
        function checkVarName(node) {
            for(var symbol = 0; symbol < node.symbols.length; symbol++) {
                if(variableKey == node.symbols[symbol].getKey()){
                    throwVarRedeclaredError(variableKey, node.symbols[symbol].getLine(), node.symbols[symbol].getCol());
                }
            }
        }

    }
}