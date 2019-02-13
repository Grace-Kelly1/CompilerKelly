/// <reference path="globals.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="utils.ts"/>
var TSCompiler;
(function (TSCompiler) {
    var token = /** @class */ (function () {
        function token(type, value, line) {
            this.type = type;
            this.value = value;
            this.line = line;
            this.type = type;
            this.value = value;
            this.line = line;
        }
        token.prototype.newToken = function (type, value, lineNumber) {
            var token = new token(type, value, lineNumber);
            return token;
        };
        return token;
    }());
    TSCompiler.token = token;
})(TSCompiler || (TSCompiler = {}));
