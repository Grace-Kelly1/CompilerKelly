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
        token.newToken = function (type, value, lineNumber) {
            var token = new token(type, value, lineNumber);
            return token;
        };
        return token;
    }());
    TSCompiler.token = token;
})(TSCompiler || (TSCompiler = {}));
