/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="Tree.ts"/>
var TSCompiler;
(function (TSCompiler) {
    var Symbol = /** @class */ (function () {
        function Symbol(key, type, line, col, scope, scopeLevel, initialized, utilized) {
            // this.key = key;
            // this.type = type;
            // this.line = line;
            // this.col = col;
            // this.scope = scope;
            // this.scopeLevel = scopeLevel;
            // this.initialized = initialized;
            // this.utilized = utilized;
        }
        Symbol.prototype.getKey = function () {
            return this.key;
        };
        Symbol.prototype.getType = function () {
            return this.type;
        };
        Symbol.prototype.getLine = function () {
            return this.line;
        };
        Symbol.prototype.getCol = function () {
            return this.col;
        };
        Symbol.prototype.getDetails = function () {
            var details = {
                type: this.type,
                line: this.line,
                initialized: this.initialized,
                utilized: this.utilized
            };
            return details;
        };
        return Symbol;
    }());
    TSCompiler.Symbol = Symbol;
})(TSCompiler || (TSCompiler = {}));
