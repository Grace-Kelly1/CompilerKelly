/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="Tree.ts"/>

module TSCompiler{
    export class parse{
        //Need to count error to print 
        //_Log_.printCSTMessage("CST	for	program: Skipped due to	PARSE error(s)");
        //Need to fix where the parse programs print 
        public parse(){
            var parseCompleted = true;
            _CurrentT_ = _Tokens_[_TokenIndex_];
            _Log_.printMessage("\nBeginning Parsing Session...");
            _Tree_ = new Tree();
            //_Tree_ .addNode("Root", "branch");
            _Log_.printParseMessage("PARSE - parse()");
            this.parseProgram();
            //_Log_.printParseMessage("Parse Completed");
            if(parseCompleted === true){
                //_Tree_: new TSCompiler.Tree();
                //console.log(_Tree_.toString());
                // _Log_.printCSTMessage("\nCST for program" + p + "...");
                _Log_.printCST();
            }
        }

        public parseProgram(){
            _Tree_ .addNode("Program", "branch");
            _Log_.printParseMessage("PARSE - parseProgram()");
            this.parseBlock();
            //console.log("this = " + this);
            //this.matchParse(EOP.type);
            _Tree_.addNode("$", "");
            _Tree_ .kick();
        }

        public parseBlock(){
            _Tree_ .addNode("Block", "branch");
            _Log_.printParseMessage("PARSE - parseBlock()");
            this.matchParse(L_BRACE.type);
            //_Tree_.addNode("{", "leaf");
            this.parseStatmentL();
            _Tree_.kick();
            //_Tree_.addNode("StatementList", "")
            this.matchParse(R_BRACE.type);
            //_Tree_.addNode("}", "leaf");
            _Tree_ .kick();
        }

        public parseStatmentL(){
            //_Tree_ .addNode("StatementList", "branch");
            if (_CurrentT_.type === PRINT.type ||
                _CurrentT_.type === ID.type ||
                _CurrentT_.type === INT.type ||
                _CurrentT_.type === BOOLEAN.type ||
                _CurrentT_.type === STRING.type ||
                _CurrentT_.type === L_BRACE.type ||
                _CurrentT_.type === WHILE.type ||
                _CurrentT_.type === IF.type
            ) {
                _Tree_ .addNode("StatementList", "branch");
                _Log_.printParseMessage("PARSE - parseStatmentL()");
                this.parseStatments();
                //this.parseStatmentL();
                _Tree_ .kick();
            }
            else{
                //_Tree_.addNode("StatementList", "branch");
                _Log_.printParseMessage("PARSE - parseStatmentL()");
            }
        }

        public  parseStatments(){
            _Tree_ .addNode("Statement", "branch");
            _Log_.printParseMessage("PARSE - parseStatements()");
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
            _Tree_ .kick();
        }

        public parseVar(){
            _Tree_ .addNode("VariableDeclaration", "branch");
            _Log_.printParseMessage("PARSE - parseVar()");
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
            _Tree_ .kick();
        }

        public parsePrint(){
            _Tree_ .addNode("PrintStatement", "branch");
            _Log_.printParseMessage("PARSE - parsePrint()");
            this.matchParse(PRINT.type);
            this.matchParse(L_PAREN.type);
            this.parseExpr();
            this.matchParse(R_PAREN.type);
            _Tree_ .kick();

        }

        public parseAssign(){
            _Tree_ .addNode("AssignmentStatement", "branch");
            _Log_.printParseMessage("PARSE - parseAssign()");
            this.parseId();
            this.matchParse(ASSIGN.type);
            this.parseExpr();
            _Tree_ .kick();
        }

        public parseWhile(){
            _Tree_ .addNode("WhileStatement", "branch");
            _Log_.printParseMessage("PARSE - parseWhile()");
            this.matchParse(WHILE.type);
            this.parseBoolean();
            this.parseBlock();
            _Tree_ .kick();
        }

        public parseIf(){
            _Tree_ .addNode("IfStatement", "branch");
            _Log_.printParseMessage("PARSE - parseIf()");
            this.matchParse(IF.type);
            this.parseBoolean();
            this.parseBlock();
            _Tree_ .kick();
        }

        public parseExpr(){
            _Tree_ .addNode("Expr", "branch");
            _Log_.printParseMessage("PARSE - parseExpr()");
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
            _Tree_ .kick();
        }

        public parseInt(){
            _Tree_ .addNode("IntExpr", "branch");
            _Log_.printParseMessage("PARSE - parseInt()");
            if (_CurrentT_.type === DIGIT.type) {
                this.matchParse(DIGIT.type);
                if (_CurrentT_.type === PLUS.type) {
                    this.matchParse(PLUS.type);
                    this.parseExpr();
                }
            }
            _Tree_ .kick();
        }

        public parseString(){
            _Tree_ .addNode("StringExpr", "branch");
            _Log_.printParseMessage("PARSE - parseString()");
            this.matchParse(QUOTE.type);
            this.parseChar();
            this.matchParse(QUOTE.type);
            _Tree_ .kick();
        }

        public parseBoolean(){
            _Tree_ .addNode("BooleanExpr", "branch");
            _Log_.printParseMessage("PARSE - parseBoolean()");
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
            _Tree_ .kick();
        }

        public parseId(){
            _Tree_ .addNode("Id", "branch");
            _Log_.printParseMessage("PARSE - parseId()");
            this.matchParse(ID.type);
            _Tree_ .kick();
        }

        public parseChar(){
            if (_CurrentT_.type === SPACE.type) 
            {
                _Tree_ .addNode("CharListSpace", "branch");
                _Log_.printParseMessage("PARSE - parseChar()");
                this.matchParse(SPACE.type);
                this.parseChar();
                _Tree_ .kick();
            } 
            else(_CurrentT_.type === CHAR.type) 
            {
                _Tree_ .addNode("CharListChar", "branch");
                _Log_.printParseMessage("PARSE - parseChar()");
                this.matchParse(CHAR.type);
                // if(_CurrentT_.type === QUOTE.type){
                //     this.parseString();
                // }
                // else{
                this.parseChar();
                // }
                _Tree_ .kick();
            }
        }

        public matchParse(type){
            if (_CurrentT_.type === type) {
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
        }
    }

}