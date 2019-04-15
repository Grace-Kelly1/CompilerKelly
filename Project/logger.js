/// <reference path="globals.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="Tree.ts"/>
/// <reference path="Scope.ts"/>
var TSCompiler;
(function (TSCompiler) {
    var logger = /** @class */ (function () {
        function logger() {
        }
        logger.prototype.printMessage = function (message) {
            var log = document.getElementById("outputTA");
            log.value += message + "\n";
        };
        logger.prototype.printError = function (message) {
            var log = document.getElementById("outputTA");
            log.value += "ERROR: " + message + "\n";
        };
        logger.prototype.printWarning = function (message) {
            var log = document.getElementById("outputTA");
            log.value += "WARNING!!!: " + message + "\n";
        };
        logger.prototype.printCST = function () {
            var log = document.getElementById('cst_output');
            //Print code not tree???
            //_Tree_ = new TSCompiler.Tree();
            log.value += _Tree_.toString();
        };
        logger.prototype.printCSTMessage = function (message) {
            var log = document.getElementById('cst_output');
            log.value += message + "\n";
        };
        logger.prototype.printASTMessage = function (message) {
            var log = document.getElementById('ast_output');
            log.value += message + "\n";
        };
        logger.prototype.printParseMessage = function (message) {
            var log = document.getElementById("outputTA");
            log.value += message + "\n";
        };
        logger.prototype.printParseError = function (message) {
            var log = document.getElementById("outputTA");
            log.value += "ERROR: " + message + "\n";
        };
        logger.prototype.printParseComplete = function () {
            var log = document.getElementById("outputTA");
            log.value += "Parse Completed" + "\n";
        };
        logger.prototype.printSAMessage = function (message) {
            var log = document.getElementById("outputTA");
            log.value += message + "\n";
        };
        logger.prototype.printSAError = function (message) {
            var log = document.getElementById("outputTA");
            log.value += "ERROR: " + message + "\n";
        };
        logger.prototype.printSAComplete = function () {
            var log = document.getElementById("outputTA");
            log.value += "Parse Completed" + "\n";
        };
        logger.logTokens = function () {
            var table = document.getElementById("token_output");
            for (var i = 0; i < _Tokens_.length; i++) {
                // Use i + 1 to keep the header on top
                var row = table.insertRow(i + 1);
                var type = row.insertCell(0);
                var value = row.insertCell(1);
                var line = row.insertCell(2);
                type.innerHTML = _Tokens_[i].type;
                value.innerHTML = _Tokens_[i].value;
                line.innerHTML = _Tokens_[i].line;
            }
        };
        logger.printSymbolT = function (symbolTable) {
            for (var i = 0; i < symbolTable.length; i++) {
                this.logScope(symbolTable[i]);
            }
        };
        logger.logScope = function (scope) {
            var table = document.getElementById('symbol-table');
            var unusedSymbols = [];
            for (var i = 0; i < scope.getSymbols().length; i++) {
                var symbols = scope.getSymbols();
                var row = table.insertRow(i + 1);
                var name = row.insertCell(0);
                var type = row.insertCell(1);
                var level = row.insertCell(2);
                var line = row.insertCell(3);
                name.innerHTML = symbols[i].getName();
                type.innerHTML = symbols[i].getType();
                level.innerHTML = scope.getName();
                line.innerHTML = symbols[i].getLine();
                if (!symbols[i].getInitialized()) {
                    unusedSymbols.push(symbols[i]);
                }
            }
        };
        return logger;
    }());
    TSCompiler.logger = logger;
})(TSCompiler || (TSCompiler = {}));
