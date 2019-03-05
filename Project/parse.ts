/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="lexer.ts"/>

module TSCompiler{
    export class parse{
        public parse(){
            _CurrentT_ = _Tokens_[_TokenIndex_];
            _CST_ = new csTree();
            this.parseProgram();
        }

        public matchParse(type){
            if (_CurrentT_.type === type) {

                _CST_.addLeaf(_CurrentT_);
                _Log_.printMessage("Successfully matched " + type + " token.");
            } else {
               // _Log_.printError("Expected " + type + ", found " + _CurrentT_.type, _CurrentT_.line, 'Parser');
                throw new Error("Error in Parse. Ending execution.");
            }

            if (_TokenIndex_ < _Tokens_.length) {
                _CurrentT_ = _Tokens_[_TokenIndex_ + 1];
                _TokenIndex_++;
            }
        }

        public parseProgram(){
            _CST_.addBranch("Program");
            this.parseBlock();
            this.matchParse(EOP.type);
            _CST_.endChildren();
        }

        public parseBlock(){
            _CST_.addBranch("Block");
            this.matchParse(L_BRACE.type);
            this.parseStatmentL();
            this.matchParse(R_BRACE.type);
            _CST_.endChildren();
        }

        public  parseStatments(){
            _CST_.addBranch("Statement");
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
            _CST_.endChildren();
        }

        public parseStatmentL(){
            if (_CurrentT_.type === PRINT.type ||
                _CurrentT_.type === ID.type ||
                _CurrentT_.type === INT.type ||
                _CurrentT_.type === BOOLEAN.type ||
                _CurrentT_.type === STRING.type ||
                _CurrentT_.type === L_BRACE.type ||
                _CurrentT_.type === WHILE.type ||
                _CurrentT_.type === IF.type
            ) {
                _CST_.addBranch("Statement List");
                this.parseStatments();
                this.parseStatmentL();
                _CST_.endChildren();
            }
        }

        public parseVar(){
            _CST_.addBranch("Variable");
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
                    //_Log_.printError("We should never have gotten to this point.", _CurrentT_.line, 'Parser')
                    throw new Error("Something broke in parser.");
            }
            _CST_.endChildren();
        }

        public parsePrint(){
            _CST_.addBranch("Print Statement");
            this.matchParse(PRINT.type);
            this.matchParse(L_PAREN.type);
            this.parseExpr();
            this.matchParse(R_PAREN.type);
            _CST_.endChildren();

        }

        public parseAssign(){
            _CST_.addBranch("Assignment Statement");
            this.parseId();
            this.matchParse(ASSIGN.type);
            this.parseExpr();
            _CST_.endChildren();
        }

        public parseWhile(){
            _CST_.addBranch("While Statement");
            this.matchParse(WHILE.type);
            this.parseBoolean();
            this.parseBlock();
            _CST_.endChildren();
        }

        public parseIf(){
            _CST_.addBranch("If Statement");
            this.matchParse(IF.type);
            this.parseBoolean();
            this.parseBlock();
            _CST_.endChildren();
        }

        public parseExpr(){
            _CST_.addBranch("Expression");
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
                   // _Log_.printError("We should never have gotten to this point.", _CurrentT_.line, 'Parser')
                    throw new Error("Something broke in parser.");
            }
            _CST_.endChildren();
        }

        public parseInt(){
            _CST_.addBranch("Int");
            if (_CurrentT_.type === DIGIT.type) {
                this.matchParse(DIGIT.type);
                if (_CurrentT_.type === PLUS.type) {
                    this.matchParse(PLUS.type);
                    this.parseExpr();
                }
            }
            _CST_.endChildren();
        }

        public parseString(){
            _CST_.addBranch("String Expression");
            this.matchParse(QUOTE.type);
            this.parseChar();
            this.matchParse(QUOTE.type);
            _CST_.endChildren();
        }

        public parseBoolean(){
            _CST_.addBranch("Boolean");
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
            _CST_.endChildren();
        }

        public parseId(){
            _CST_.addBranch("ID");
            this.matchParse(ID.type);
            _CST_.endChildren();
        }

        public parseChar(){
            if (_CurrentT_.type === SPACE.type) 
            {
                _CST_.addBranch("Char");
                this.matchParse(SPACE.type);
                this.parseChar();
                _CST_.endChildren();
            } else(_CurrentT_.type === CHAR.type) 
            {
                _CST_.addBranch("Char");
                this.matchParse(CHAR.type);
                this.parseChar();
                _CST_.endChildren();
            }
        }

    }

}