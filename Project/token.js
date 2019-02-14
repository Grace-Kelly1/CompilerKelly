/// <reference path="globals.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="utils.ts"/>
var TSCompiler;
(function (TSCompiler) {
    var Token = /** @class */ (function () {
        // Type: string;
        // Value: string;
        // Line: number;
        // public newToken(type, value, line){
        //     var Token = new Token(type, value, line);
        //     return Token;
        // }
        function Token(type, value, line) {
            this.type = type;
            this.value = value;
            this.line = line;
            // this.type = type;
            // this.value = value;
            // this.line = line;
        }
        return Token;
    }());
    TSCompiler.Token = Token;
})(TSCompiler || (TSCompiler = {}));
