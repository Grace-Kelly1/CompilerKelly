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
            this.scope = -1;
            this.scopeLevel = -1;
            this.saErrorCount = 0;
            this.saWarningCount = 0;
            this.currentToken = 0;
            this.symbolTableStrings = "";
            this.symbolArray = [];
            this.variableKey = "";
            this.variableType = "";
            this.variableLine = 0;
            this.variableCol = 0;
            this.checkedType = "";
        }
        SemAnalysis.prototype.SA = function () {
            var parseCompleted = true;
            _TokenIndex_ = 0;
            _CurrentT_ = _Tokens_[_TokenIndex_];
            //console.log(_CurrentT_.type);
            _Log_.printMessage("\nBeginning Semantic Analysis Session...");
            _SymbolTree_ = new TSCompiler.symbolTree();
            //_SymbolTree_ .addNode("Root", "branch");
            this.parseProgram();
            this.checkInit(_SymbolTree_.root);
            this.checkUsed(_SymbolTree_.root);
            if (this.saErrorCount == 0) {
                parseCompleted = true;
                _Log_.printMessage("\nSemantic Analysis Session Finished.");
                _Log_.printSymbolTable(this.symbolTableStrings);
            }
        };
        SemAnalysis.prototype.parseProgram = function () {
            this.parseBlock();
            //console.log("this = " + this);
            this.matchParse(EOP.type);
            _SymbolTree_.kick();
            _SymbolTree_.kick();
        };
        SemAnalysis.prototype.parseBlock = function () {
            this.scope = this.scope + 1;
            this.scopeLevel = this.scopeLevel + 1;
            _SymbolTree_.addNode("ScopeLevel: " + this.scope, "brach", this.scope);
            this.matchParse(L_BRACE.type);
            //_SymbolTree_.addNode("{", "leaf");
            this.parseStatmentL();
            //_SymbolTree_.kick();
            //_SymbolTree_.addNode("StatementList", "")
            this.matchParse(R_BRACE.type);
            this.scopeLevel = this.scopeLevel - 1;
            //_SymbolTree_.addNode("}", "leaf");
            _SymbolTree_.kick();
        };
        SemAnalysis.prototype.parseStatmentL = function () {
            //_SymbolTree_ .addNode("StatementList", "branch");
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
                _SymbolTree_.kick();
            }
        };
        SemAnalysis.prototype.parseStatments = function () {
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
            _SymbolTree_.kick();
        };
        SemAnalysis.prototype.parseVar = function () {
            //_SymbolTree_ .addNode();
            switch (_CurrentT_.type) {
                case STRING.type:
                    this.matchParse(STRING.type);
                    this.parseId();
                    this.checkVarName(_SymbolTree_.cur);
                    _Symbol_ = new TSCompiler.Symbol(this.variableKey, this.variableType, this.variableLine, this.variableCol, _SymbolTree_.cur.scope, this.scopeLevel, false, false);
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
            _SymbolTree_.kick();
        };
        SemAnalysis.prototype.parsePrint = function () {
            this.matchParse(PRINT.type);
            this.matchParse(L_PAREN.type);
            this.parseExpr();
            this.matchParse(R_PAREN.type);
            _SymbolTree_.kick();
        };
        SemAnalysis.prototype.parseAssign = function () {
            var idKey = "";
            this.parseId();
            this.checkVarDeclared(_SymbolTree_.cur, "assigned");
            this.checkVarType(_SymbolTree_.cur, "assigned");
            var idType = this.checkedType;
            this.declareInit(_SymbolTree_.cur);
            this.matchParse(ASSIGN.type);
            var experType = this.parseExpr();
            if (idType === experType) {
                //printSATypeCheckMessage(idKey,idType,"assigned",experType);
            }
            else {
                _Log_.printError(idKey + ":" + idType + "assigned " + experType);
            }
            _SymbolTree_.kick();
        };
        SemAnalysis.prototype.parseWhile = function () {
            this.matchParse(WHILE.type);
            this.parseBoolean();
            this.parseBlock();
            _SymbolTree_.kick();
        };
        SemAnalysis.prototype.parseIf = function () {
            this.matchParse(IF.type);
            this.parseBoolean();
            this.parseBlock();
            _SymbolTree_.kick();
        };
        //Work on!!
        SemAnalysis.prototype.parseExpr = function () {
            var experType = "";
            switch (_CurrentT_.type) {
                // IntExpr
                case DIGIT.type:
                    experType = this.parseInt();
                    break;
                // String
                case QUOTE.type:
                    this.parseString();
                    break;
                // Boolean
                case L_PAREN.type:
                case TRUE.type:
                case FALSE.type:
                    experType = this.parseBoolean();
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
            _SymbolTree_.kick();
            return experType;
        };
        //Work on!!
        SemAnalysis.prototype.parseInt = function () {
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
                    if (intExper1 == intExper2) {
                        intExperType = intExper2;
                    }
                    else {
                        _Log_.printError("" + intExper1 + " Added: " + intExper2);
                    }
                }
            }
            _SymbolTree_.kick();
            return intExperType;
        };
        //Work on!!
        SemAnalysis.prototype.parseString = function () {
            this.matchParse(QUOTE.type);
            var stringExperType = this.parseChar();
            this.matchParse(QUOTE.type);
            _SymbolTree_.kick();
            return stringExperType;
        };
        //Work on!!
        SemAnalysis.prototype.parseBoolean = function () {
            var booleanExperType = "";
            if (_CurrentT_.type === TRUE.type) {
                this.matchParse(TRUE.type);
            }
            else if (_CurrentT_.type === FALSE.type) {
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
            _SymbolTree_.kick();
            return booleanExperType;
        };
        SemAnalysis.prototype.parseId = function () {
            //_SymbolTree_.addNode(_CurrentT_.type, "leaf");
            this.variableKey = _Tokens_[_TokenIndex_].value;
            this.variableLine = _Tokens_[_TokenIndex_].rowNum;
            this.variableCol = _Tokens_[_TokenIndex_].colNum;
            this.matchParse(ID.type);
            _SymbolTree_.kick();
        };
        SemAnalysis.prototype.parseChar = function () {
            if (_CurrentT_.type === SPACE.type) {
                this.matchParse(SPACE.type);
                this.parseChar();
                _SymbolTree_.kick();
            }
            else
                (_CurrentT_.type === CHAR.type);
            {
                //_SymbolTree_.addNode(_CurrentT_.value, "leaf");
                this.matchParse(CHAR.type);
                // if(_CurrentT_.type === QUOTE.type){
                //     this.parseString();
                // }
                // else{
                this.parseChar();
                // }
                _SymbolTree_.kick();
            }
        };
        SemAnalysis.prototype.matchParse = function (type) {
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
        SemAnalysis.prototype.checkUsed = function (node) {
            for (var symbol = 0; symbol < node.symbols.length; symbol++) {
                if (node.symbols[symbol].initialized == true && node.symbols[symbol].utilized == false) {
                    _Log_.printWarning("Unused: " + node.symbols[symbol].key);
                }
            }
            if (node.children.length != 0) {
                node.children.forEach(function (child) {
                    this.checkUsed(child);
                });
            }
        };
        SemAnalysis.prototype.checkInit = function (node) {
            for (var symbol = 0; symbol < node.symbols.length; symbol++) {
                if (node.symbols[symbol].initialized == false) {
                    _Log_.printWarning("Not Init: " + node.symbols[symbol].key);
                }
            }
            if (node.children.length != 0) {
                node.children.forEach(function (child) {
                    this.checkInit(child);
                });
            }
        };
        SemAnalysis.prototype.checkVarDeclared = function (node, usage) {
            if ((node.parent != undefined || node.parent != null) && node.symbols.length > 0) {
                for (var symbol = 0; symbol < node.symbols.length; symbol++) {
                    if (node.symbols[symbol].getKey() == _Tokens_[_TokenIndex_ - 1].value) {
                        _Log_.printWarning("Declared: " + node.symbols[symbol].key);
                    }
                    else if (symbol == node.symbols.length - 1 && (node.parent != undefined || node.parent != null)) {
                        this.checkVarDeclared(node.parent, usage);
                        break;
                    }
                }
            }
            else if (node.parent != undefined || node.parent != null) {
                this.checkVarDeclared(node.parent, usage);
            }
            else {
                _Log_.printError(_Tokens_[_TokenIndex_ - 1].value + "Use: " + usage);
            }
        };
        SemAnalysis.prototype.checkVarType = function (node, usage) {
            if ((node.parent != undefined || node.parent != null) && node.symbols.length > 0) {
                for (var symbol = 0; symbol < node.symbols.length; symbol++) {
                    if (node.symbols[symbol].getKey() == _Tokens_[_TokenIndex_ - 1].value) {
                        this.checkedType = node.symbols[symbol].getType();
                        _Log_.printMessage(_Tokens_[_TokenIndex_ - 1].value + "Check: " + this.checkedType);
                        break;
                    }
                    else if (symbol == node.symbols.length - 1 && (node.parent != undefined || node.parent != null)) {
                        this.checkVarType(node.parent, usage);
                        break;
                    }
                }
            }
            else if (node.parent != undefined || node.parent != null) {
                this.checkVarType(node.parent, usage);
            }
        };
        SemAnalysis.prototype.declareUsed = function (node) {
            if ((node.parent != undefined || node.parent != null) && node.symbols.length > 0) {
                for (var symbol = 0; symbol < node.symbols.length; symbol++) {
                    if (node.symbols[symbol].getKey() == _Tokens_[_TokenIndex_ - 1].value) {
                        node.symbols[symbol].utilized = true;
                        _Log_.printMessage(_Tokens_[_TokenIndex_ - 1].value);
                        break;
                    }
                    else if (symbol == node.symbols.length - 1 && (node.parent != undefined || node.parent != null)) {
                        this.declareUsed(node.parent);
                        break;
                    }
                }
            }
            else if (node.parent != undefined || node.parent != null) {
                this.declareUsed(node.parent);
            }
        };
        SemAnalysis.prototype.declareInit = function (node) {
            if ((node.parent != undefined || node.parent != null) && node.symbols.length > 0) {
                for (var symbol = 0; symbol < node.symbols.length; symbol++) {
                    if (node.symbols[symbol].getKey() == _Tokens_[_TokenIndex_ - 1].value) {
                        node.symbols[symbol].initialized = true;
                        _Log_.printMessage(_Tokens_[_TokenIndex_ - 1].value);
                        break;
                    }
                    else if (symbol == node.symbols.length - 1 && (node.parent != undefined || node.parent != null)) {
                        this.declareInit(node.parent);
                        break;
                    }
                }
            }
            else if (node.parent != undefined || node.parent != null) {
                this.declareInit(node.parent);
            }
        };
        SemAnalysis.prototype.checkVarName = function (node) {
            for (var symbol = 0; symbol < node.symbols.length; symbol++) {
                if (this.variableKey == node.symbols[symbol].getKey()) {
                    _Log_.printError(this.variableKey + node.symbols[symbol].getLine() + node.symbols[symbol].getCol());
                }
            }
        };
        return SemAnalysis;
    }());
    TSCompiler.SemAnalysis = SemAnalysis;
})(TSCompiler || (TSCompiler = {}));
