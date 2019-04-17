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
        private scope = -1;
        private scopeLevel = -1;
        private saErrorCount = 0;
        private saWarningCount = 0;
        private currentToken = 0;
        private symbolTableStrings = "";
        private symbolArray = [];
        private variableKey = "";
        private variableType = "";
        private variableLine = 0;
        private variableCol = 0;
        private checkedType = "";

        public SA(){
            var parseCompleted = true;
            _TokenIndex_ = 0;
            _CurrentT_ = _Tokens_[_TokenIndex_];
            //console.log(_CurrentT_.type);
            
            _Log_.printMessage("\nBeginning Semantic Analysis Session...");
            
            _SymbolTree_ = new symbolTree();
            //_SymbolTree_ .addNode("Root", "branch");
            this.parseProgram();
            this.checkInit(_SymbolTree_.root);
            this.checkUsed(_SymbolTree_.root);
            if(this.saErrorCount == 0){
                parseCompleted = true;
                _Log_.printMessage("\nSemantic Analysis Session Finished.");
                _Log_.printSymbolTable(this.symbolTableStrings);
            }
            
        }

        public parseProgram(){
            this.parseBlock();
            //console.log("this = " + this);
            this.matchParse(EOP.type);
            _SymbolTree_.kick();
            _SymbolTree_ .kick();
        }

        public parseBlock(){
            this.scope = this.scope + 1;
            this.scopeLevel = this.scopeLevel + 1;
            _SymbolTree_ .addNode("ScopeLevel: " + this.scope, "brach", this.scope);
            this.matchParse(L_BRACE.type);
            //_SymbolTree_.addNode("{", "leaf");
            this.parseStatmentL();
            //_SymbolTree_.kick();
            //_SymbolTree_.addNode("StatementList", "")
            this.matchParse(R_BRACE.type);
            this.scopeLevel = this.scopeLevel -1;
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
            //_SymbolTree_ .addNode();
            switch (_CurrentT_.type) {
                case STRING.type:
                this.matchParse(STRING.type);
                    this.parseId();
                    this.checkVarName(_SymbolTree_.cur);
                    _Symbol_ = new Symbol(this.variableKey, this.variableType, this.variableLine, this.variableCol, _SymbolTree_.cur.scope, this.scopeLevel, false, false);
                    _SymbolTree_.cur.symbols.push(_Symbol_);
                    this.symbolArray.push(_Symbol_);
                    this.symbolTableStrings = this.symbolTableStrings + "<tr ><td>" + _Symbol_.key + "</td><td>" + _Symbol_.type + "</td><td>" + _Symbol_.scope + "</td><td>" + _Symbol_.scopeLevel + "</td><td>" + _Symbol_.line + "</td><td>" + _Symbol_.col + "</td></tr>";
                    this.variableKey = "";
                    this.variableType = "";
                    this.variableLine = 0;
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
            var idKey = "";
            this.parseId();
            this.checkVarDeclared(_SymbolTree_.cur, "assigned")
            this.checkVarType(_SymbolTree_.cur, "assigned");
            var idType = this.checkedType;
            this.declareInit(_SymbolTree_.cur);
            this.matchParse(ASSIGN.type);
            var experType = this.parseExpr();
            if (idType === experType){
                //printSATypeCheckMessage(idKey,idType,"assigned",experType);
            }
            else{
                _Log_.printError(idKey + ":" + idType + "assigned " + experType);
            }

            _SymbolTree_ .kick();
        }

        public parseWhile(){
            this.matchParse(WHILE.type);
            this.parseBoolean();
            this.parseBlock();
            _SymbolTree_ .kick();
        }

        public parseIf(){
            this.matchParse(IF.type);
            this.parseBoolean();
            this.parseBlock();
            _SymbolTree_ .kick();
        }
        //Work on!!
        public parseExpr(){
            var experType = "";
            switch (_CurrentT_.type) {
                // IntExpr
                case DIGIT.type:
                experType =this.parseInt();
                    break;
                // String
                case QUOTE.type:
                this.parseString();
                    break;
                // Boolean
                case L_PAREN.type:
                case TRUE.type:
                case FALSE.type:
                experType =this.parseBoolean();
                    break;
                // ID
                case ID.type:
                    this.parseId();
                    this.checkVarDeclared(_SymbolTree_.cur, "used");
                    this.declareUsed(_SymbolTree_.cur);
                    this.checkVarType(_SymbolTree_.cur, "used");
                     experType = this.checkedType;
                    break;
                default:
                    _Log_.printParseError("Expected to finish assigning variable");
                    //throw new Error("Something broke in parser.");
            }
            _SymbolTree_ .kick();
            return experType;
        }
        //Work on!!
        public parseInt(){
            var intExperType = "";
            //console.log(_CurrentT_.value);
            if (_CurrentT_.type === DIGIT.type) {
                var intExper1 = _CurrentT_.value;
                var intExperType = _CurrentT_.value;
                //_SymbolTree_.addNode(_CurrentT_.value, "leaf");
                this.matchParse(DIGIT.type);
                if (_CurrentT_.type === PLUS.type) {
                    this.matchParse(PLUS.type);
                    var intExper2 = this.parseExpr();
                    if(intExper1 == intExper2){
                        intExperType = intExper2;
                    } else {
                        _Log_.printError("" + intExper1 + " Added: " +intExper2);
                    }
                }
            }
            _SymbolTree_ .kick();
            return intExperType;
        }
        //Work on!!
        public parseString(){
            this.matchParse(QUOTE.type);
            var stringExperType = this.parseChar();
            this.matchParse(QUOTE.type);
            _SymbolTree_ .kick();
            return stringExperType;
        }
        //Work on!!
        public parseBoolean(){
            var booleanExperType = "";
            if (_CurrentT_.type === TRUE.type) {
                this.matchParse(TRUE.type);
            } else if (_CurrentT_.type === FALSE.type) {
                 
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
            return booleanExperType;
        }

        public parseId(){
            //_SymbolTree_.addNode(_CurrentT_.type, "leaf");
            this.variableKey = _Tokens_[_TokenIndex_].value;
            this.variableLine = _Tokens_[_TokenIndex_].rowNum;
            this.variableCol = _Tokens_[_TokenIndex_].colNum;
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

        public checkUsed(node) {
            for(var symbol = 0; symbol < node.symbols.length; symbol++) {
                if(node.symbols[symbol].initialized == true && node.symbols[symbol].utilized == false) {
                    _Log_.printWarning("Unused: " + node.symbols[symbol].key);
                }
            }
            if(node.children.length != 0) {
                node.children.forEach(function(child) {
                    this.checkUsed(child);
                });
            }
        }
        public checkInit(node) {
            for(var symbol = 0; symbol < node.symbols.length; symbol++) {
                if(node.symbols[symbol].initialized == false) {
                    _Log_.printWarning("Not Init: " + node.symbols[symbol].key);
                }
            }
            if(node.children.length != 0) {
                node.children.forEach(function(child) {
                    this.checkInit(child);
                });
            }
        }
        public checkVarDeclared(node,usage) {
            if((node.parent != undefined || node.parent != null) && node.symbols.length > 0) {
                for(var symbol = 0; symbol < node.symbols.length; symbol++) {
                    if(node.symbols[symbol].getKey() == _Tokens_[_TokenIndex_ - 1].value) {
                        _Log_.printWarning("Declared: " + node.symbols[symbol].key);
                    } else if(symbol == node.symbols.length-1 && (node.parent != undefined || node.parent != null)) {
                        this.checkVarDeclared(node.parent,usage);
                        break;
                    }
                }
            } else if(node.parent != undefined || node.parent != null) {
                this.checkVarDeclared(node.parent,usage);
            } else {
                _Log_.printError(_Tokens_[_TokenIndex_ - 1].value + "Use: " +usage);
            }
        }
        public checkVarType(node,usage) {
            if((node.parent != undefined || node.parent != null) && node.symbols.length > 0) {
                for(var symbol = 0; symbol < node.symbols.length; symbol++) {
                    if(node.symbols[symbol].getKey() == _Tokens_[_TokenIndex_ - 1].value) {
                        this.checkedType = node.symbols[symbol].getType();
                            _Log_.printMessage(_Tokens_[_TokenIndex_ - 1].value + "Check: " + this.checkedType);
                        break
                    } else if(symbol == node.symbols.length-1 && (node.parent != undefined || node.parent != null)) {
                        this.checkVarType(node.parent,usage);
                        break;
                    }
                }
            } else if(node.parent != undefined || node.parent != null) {
                this.checkVarType(node.parent,usage);
            }
        }
        public declareUsed(node) {
            if((node.parent != undefined || node.parent != null) && node.symbols.length > 0) {
                for(var symbol = 0; symbol < node.symbols.length; symbol++) {
                    if(node.symbols[symbol].getKey() == _Tokens_[_TokenIndex_ - 1].value) {
                        node.symbols[symbol].utilized = true;
                            _Log_.printMessage(_Tokens_[_TokenIndex_ - 1].value);
                        break
                    } else if(symbol == node.symbols.length-1 && (node.parent != undefined || node.parent != null)) {
                        this.declareUsed(node.parent);
                        break;
                    }
                }
            } else if(node.parent != undefined || node.parent != null) {
                this.declareUsed(node.parent);
            }
        }
        public declareInit(node) {
            if((node.parent != undefined || node.parent != null) && node.symbols.length > 0) {
                for(var symbol = 0; symbol < node.symbols.length; symbol++) {
                    if(node.symbols[symbol].getKey() == _Tokens_[_TokenIndex_ - 1].value) {
                        node.symbols[symbol].initialized = true;
                            _Log_.printMessage(_Tokens_[_TokenIndex_ - 1].value);
                        break
                    } else if(symbol == node.symbols.length-1 && (node.parent != undefined || node.parent != null)) {
                        this.declareInit(node.parent);
                        break;
                    }
                }
            } else if(node.parent != undefined || node.parent != null) {
                this.declareInit(node.parent);
            }
        }
        public checkVarName(node) {
            for(var symbol = 0; symbol < node.symbols.length; symbol++) {
                if(this.variableKey == node.symbols[symbol].getKey()){
                    _Log_.printError(this.variableKey + node.symbols[symbol].getLine() + node.symbols[symbol].getCol());
                }
            }
        }

    }
}