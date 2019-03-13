// Main document for lexer code 
// Rule Priority: keyword, id, symbol, digit, char
// Uses regular expressions 
/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
var TSCompiler;
(function (TSCompiler) {
    var lexer = /** @class */ (function () {
        function lexer() {
        }
        lexer.prototype.lexerCode = function () {
            //Error Count 
            var lexerError = 0;
            //initiate variables for keywords and symbols
            var keywords = ['print', 'while', 'if', 'int', 'string', 'boolean', 'false', 'true'];
            var symbols = ['{', '}', '(', ')', '"', '=', '==', '!=', '+', '$'];
            //Regular Expressions for id, digit and char
            var id_RE = /^[a-z]+$/;
            var digit_RE = /0|(^[1-9]([0-9])*)$/;
            //Char and String needed?
            var char_RE = /^[a-z]$/;
            var codeString = false;
            var string_RE = /^"[a-z\s]*"$/;
            //Regular Expression for anything needed?
            //var any_RE: RegExp = /([a-z]+)|([0-9])|("([a-z ])*")|(\/\*[^\/\*]*\*\/)|(==)|(!=)|(\S)|(\n)|(\t)|(\s)/g;
            var any_RE = /[a-z]+|[1-9]|(==)|(!=)|"[^"]*"|(")|(\/\*[^\/\*]*\*\/)|(\S)|(\n)/g;
            //Comments
            var com_RE = /\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+/;
            var comHalf_RE = /\*+/;
            //new line
            //var line_RE = /\n/;
            //Trying to implement multiple programs
            var programCount = 1;
            //Regular Expression for whitespace or just space needed?
            //First Print NEED TO ADD WHAT PROGRAM
            _Log_.printMessage("INFO Lexer - program " + programCount);
            //Grab Code and trim and split into lines to get length
            var inputCode = document.getElementById("inputTA").value;
            //console.log("Gets inside lexer.ts");
            inputCode = inputCode.trim();
            //Check for $
            if (inputCode[inputCode.length - 1] != '$') {
                _Log_.printWarning("Missing $ at end of program");
                document.getElementById("inputTA").value += '$';
                inputCode += '$';
            }
            var inputLines = inputCode.split("\n");
            var inputLength = inputLines.length;
            for (var x = 0; x < inputLength; x++) {
                inputLines[x] = (inputLines[x].replace(/^\s+ | \s+$/g, ""));
            }
            //console.log(inputCode);
            // console.log(inputLines); //VALUE?
            //_Tokens_ = new TSCompiler.token;
            //Loop through the code 
            for (var x = 0; x < inputLength; x++) {
                // if(x > inputLength - 1){
                //     break;
                // }
                //Make sure it is in grammer atleast
                var checkRE = inputLines[x].match(any_RE);
                //console.log(checkRE);
                if (checkRE === null) {
                    //console.log("New Line")
                }
                else {
                    var checkLength = checkRE.length;
                }
                //Check is matched to any_RE
                if (checkRE != null) {
                    //Tokens 
                    for (var y = 0; y < checkLength; y++) {
                        var currentT = checkRE[y];
                        //Find Tokens
                        //Check if keyword 
                        if (keywords.indexOf(currentT) > -1) {
                            for (var k = 0; k < _Keywords_.length; k++) {
                                if (currentT === _Keywords_[k].value) {
                                    var tokenType = _Keywords_[k].type;
                                    var tokenValue = _Keywords_[k].value;
                                    var token = new TSCompiler.Token(tokenType, tokenValue, x);
                                    var stuff = (tokenType + " [ " + tokenValue + " ] " + " one line " + x);
                                    //var token = token.newToken(tokenType, tokenValue, x+1);
                                    _Tokens_.push(token);
                                    _Log_.printMessage("DEBUG Lexer -" + stuff);
                                }
                            }
                        }
                        //Check if id 
                        else if (id_RE.test(currentT)) {
                            for (var i = 0; i < 1; i++) {
                                var token = new TSCompiler.Token('ID', currentT[i], x);
                                var stuff = ('ID' + " [ " + currentT[i] + " ] " + " one line " + x);
                                _Tokens_.push(token);
                                // console.log(currentT);
                                _Log_.printMessage("DEBUG Lexer -" + stuff);
                            }
                        }
                        //multi programs
                        else if (currentT === '$') {
                            _Log_.printMessage("Lex analysis complete - program" + programCount);
                            var token = new TSCompiler.Token('EOP', currentT[i], x);
                            _Tokens_.push(token);
                            if (lexerError === 0) {
                                _Log_.printCSTMessage("\nCST for program" + programCount + "...");
                                _Parser_.parse();
                                // _Log_.printCST();
                                programCount++;
                            }
                            else {
                                _Log_.printParseMessage("\nPARSE - Skipped due to LEXER error(s)");
                                _Log_.printCSTMessage("\nCST for program " + programCount + ": Skipped due to LEXER error(s)");
                            }
                            _Log_.printMessage("\n" + "INFO Lexer - program " + programCount);
                            lexerError = 0;
                        }
                        //Check if symbol 
                        else if (symbols.indexOf(currentT) > -1) {
                            for (var s = 0; s < _Pun_.length; s++) {
                                if (currentT === _Pun_[s].value) {
                                    var tokenType = _Pun_[s].type;
                                    //console.log(tokenType);
                                    var tokenValue = _Pun_[s].value;
                                    var token = new TSCompiler.Token(tokenType, tokenValue, x);
                                    var stuff = (tokenType + " [ " + tokenValue + " ] " + " one line " + x);
                                    //_Tokens_ = new TSCompiler.token();
                                    //let Token = token(tokenType, tokenValue, x + 1);
                                    // _CurrentT_ = new TSCompiler.token;
                                    //let token = _CurrentT_.newToken(tokenType, tokenValue, x + 1);
                                    if ((token.type === QUOTE.type) && (codeString === true)) {
                                        _Tokens_.push(token);
                                        codeString = !codeString;
                                        _Log_.printMessage("DEBUG Lexer -" + stuff);
                                    }
                                    else if ((token.type === QUOTE.type) && (codeString === false)) {
                                        _Log_.printError(" not complete string");
                                        lexerError = lexerError + 1;
                                        throw new Error("...Ending Lexer");
                                    }
                                    else {
                                        _Tokens_.push(token);
                                        _Log_.printMessage("DEBUG Lexer -" + stuff);
                                    }
                                    //_Tokens_.push(token);
                                    //_Log_.printMessage("DEBUG Lexer -" + stuff);
                                }
                            }
                        }
                        //Check if digit 
                        else if (digit_RE.test(currentT)) {
                            // if(currentT === '"'){
                            //     console.log("Not a digit");
                            // }
                            //console.log(currentT);
                            for (var i = 0; i < currentT.length; i++) {
                                var token = new TSCompiler.Token('DIGIT', currentT[i], x);
                                var stuff = ('DIGIT' + " [ " + currentT[i] + " ] " + " one line " + x);
                                _Tokens_.push(token);
                                _Log_.printMessage("DEBUG Lexer -" + stuff);
                            }
                        }
                        //Check if char
                        else if (char_RE.test(currentT)) {
                            for (var i = 0; i < currentT.length; i++) {
                                var token = new TSCompiler.Token('CHAR', currentT[i], x);
                                var stuff = ('CHAR' + " [ " + currentT[i] + " ] " + " one line " + x);
                                _Tokens_.push(token);
                                _Log_.printMessage("DEBUG Lexer -" + stuff);
                            }
                        }
                        // else if(currentT === '"'){
                        //     var token = new Token(QUOTE.type, QUOTE.value, x);
                        //     var stuff = ('QUOTE' + " [ " + QUOTE.value + " ] " + " one line " + x+1)
                        //      _Log_.printMessage("DEBUG Lexer -" + token);
                        //     _Tokens_.push(stuff);
                        // }
                        //console.log("STOP");
                        //Do I need to check strings?
                        else if (string_RE.test(currentT)) {
                            //console.log(currentT);
                            // codeString = !codeString;
                            // this.sepString(currentT, x+1);
                            // codeString = !codeString;
                            //break;
                            for (var i = 0; i < currentT.length; i++) {
                                if (currentT[i] === '"') {
                                    var token = new TSCompiler.Token(QUOTE.type, currentT[i], x + 1);
                                    var stuff = ('QUOTE' + " [ " + currentT[i] + " ] " + " one line " + x);
                                    _Log_.printMessage("DEBUG Lexer -" + stuff);
                                    _Tokens_.push(token);
                                }
                                else if (currentT[i] === ' ') {
                                    var token = new TSCompiler.Token(SPACE.type, currentT[i], x + 1);
                                    var stuff = ('SPACE' + " [ " + currentT[i] + " ] " + " one line " + x);
                                    _Log_.printMessage("DEBUG Lexer -" + stuff);
                                    _Tokens_.push(token);
                                }
                                else if (currentT[i] === "/" && currentT[i + 1] === "*") {
                                    //console.log("String Comment");
                                    i = i + 2;
                                    while (currentT[i] != "/") {
                                        i++;
                                        //console.log("StringComment");
                                    }
                                    i++;
                                }
                                else {
                                    var token = new TSCompiler.Token('CHAR', currentT[i], x);
                                    var stuff = ('CHAR' + " [ " + currentT[i] + " ] " + " one line " + x);
                                    _Tokens_.push(token);
                                    _Log_.printMessage("DEBUG Lexer -" + stuff);
                                }
                            }
                        }
                        //ignoring comments
                        else if (com_RE.test(currentT)) {
                            console.log("Comment");
                        }
                        else if (comHalf_RE.test(currentT)) {
                            _Log_.printError(" Not finished Comment" + " on line " + x);
                        }
                        //None throw error
                        else {
                            _Log_.printError(" Invalid Token " + "[" + currentT + "]" + " on line " + x);
                            lexerError = lexerError + 1;
                            //console.log(currentT);
                        }
                    }
                }
            }
        };
        return lexer;
    }());
    TSCompiler.lexer = lexer;
})(TSCompiler || (TSCompiler = {}));
