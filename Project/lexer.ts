//Main document for lexer code 
//Rule Priority: keyword, id, symbol, digit, char
//Uses regular expressions 

module TSCompiler{
    export class lexer{
        public static lexerCode(){
            //initiate variables for keywords and symbols
            var keywords = ['print', 'while', 'if', 'int', 'string', 'boolean', 'false', 'true'];
            var symbols = ['{', '}', '(', ')', '"', '=', '==', '!=', '+', '$'];
            //Regular Expressions for id, digit and char
            var id_RE: RegExp = /^[a-z]+$/;
            var digit_RE: RegExp = /0|(^[1-9]([0-9])*)$/;
            //Char and String needed?
            var char_RE: RegExp = /^[a-z]$/;
            var string = false;
            var string_RE: RegExp = /^"[a-z\s]*"$/;
            //Regular Expression for anything needed?
            var any_RE: RegExp = /[a-z]+|[1-9]|(=)|(==)|(!=)|"[^"]*"|(\s)/;
            //Regular Expression for whitespace or just space needed?

            //Grab Code and trim and split into lines to get length
            var inputCode = (<HTMLInputElement>document.getElementById('input_Code')).value;
            inputCode = inputCode.trim();
            var inputLines: Array<String> = inputCode.split("\n");
            var inputLength = inputLines.length;
            for (var x = 0; x < inputLength; x++) {
                inputLines[x] = (inputLines[x].replace(/^\s+ | \s+$/g, ""));
            }

            //Loop through the code 
            for(var x = 0; x < inputLength; x++){
                //Make sure it is in grammer atleast
                var checkRE = inputLines[x].match(any_RE);
                var checkLength = checkRE.length;
                //Check is matched to any_RE
                if(checkRE != null){
                    //Tokens 
                    for(var y = 0; y < checkLength; y++){
                        var currentT = checkRE[y];
                        
                        //Find Tokens
                        //Check if keyword 
                        if(keywords.indexOf(currentT) > -1){
                            for(var k = 0; k < _Keywords_.length; k++){
                                if(currentT === _Keywords_[k].value){
                                    var tokenType = _Keywords_[k].type;
                                    var tokenValue =  _Keywords_[k].value;
                                    var token = token.newToken(tokenType, tokenValue, x+1);
                                    _Tokens_.push(token);
                                }
                            }
                        }

                        //Check if id 
                        else if(id_RE.test(currentT)){
                            for (var i = 0; i < currentT.length; i++){
                                if(){
                                    var token = token.newToken('ID', currentT[i], x+1);
                                    _Tokens_.push(token);
                                }
                            }
                        }
                        //Check if symbol 
                        else if(symbols.indexOf(currentT) > -1){
                            for (var s = 0; s < _Pun_.length; s++){
                                if(currentT === _Pun_[s].value){
                                    var tokenType = _Pun_[s].type;
                                    var tokenValue = _Pun_[s].value;
                                    var token = token.newToken(tokenType, tokenValue, x+1);
                                    _Tokens_.push(token);
                                }
                            }
                        }

                        //Check if digit 
                        else if(digit_RE.test(currentT)){
                            for (var i = 0; i < currentT.length; i++){
                                var token = token.newToken('DIGIT', currentT[i], x+1);
                                _Tokens_.push(token);
                            }
                        }

                        //Check if char
                        else if(char_RE.test(currentT)){
                            for (var i = 0; i < currentT.length; i++){
                                if(){
                                    var token = token.newToken('CHAR', currentT[i], x+1);
                                }
                            }
                        }

                        //Do I need to check strings??

                        //None throw error
                        else{

                        }

                    }
                }
            }   
        }
    }
}
