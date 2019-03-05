/// <reference path="globals.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
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
            log.value = _CST_.toString();
        };
        logger.printTokens = function () {
            var table = document.getElementById('token_output');
            for (var i = 0; i < _Tokens_.length; i++) {
                var row = table.insertRow(i + 1);
                var type = row.insertCell(0);
                var value = row.insertCell(1);
                var line = row.insertCell(2);
                type.innerHTML = _Tokens_[i].type;
                value.innerHTML = _Tokens_[i].value;
                line.innerHTML = _Tokens_[i].line;
            }
        };
        return logger;
    }());
    TSCompiler.logger = logger;
})(TSCompiler || (TSCompiler = {}));
