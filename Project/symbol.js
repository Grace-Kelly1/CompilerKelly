/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="Tree.ts"/>
var TSCompiler;
(function (TSCompiler) {
    var Symbol = /** @class */ (function () {
        function Symbol(name, type, line) {
            this.isInitialized = false;
            this.setName(name);
            this.setType(type);
            this.setLine(line);
        }
        Symbol.prototype.getName = function () {
            return this.name;
        };
        Symbol.prototype.setName = function (name) {
            this.name = name;
        };
        Symbol.prototype.getType = function () {
            return this.type;
        };
        Symbol.prototype.setType = function (type) {
            this.type = type;
        };
        Symbol.prototype.getLine = function () {
            return this.line.toString();
        };
        Symbol.prototype.setLine = function (line) {
            this.line = line;
        };
        Symbol.prototype.getInitialized = function () {
            return this.isInitialized;
        };
        Symbol.prototype.setInitialized = function (bool) {
            this.isInitialized = bool;
        };
        return Symbol;
    }());
    TSCompiler.Symbol = Symbol;
})(TSCompiler || (TSCompiler = {}));
