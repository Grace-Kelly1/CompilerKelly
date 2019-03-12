/// <reference path="globals.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="Tree.ts"/>
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
        logger.prototype.printParseMessage = function (message) {
            var log = document.getElementById("outputTA");
            log.value += message + "\n";
        };
        logger.prototype.printParseError = function (message) {
            var log = document.getElementById("outputTA");
            log.value += "ERROR: " + message + "\n";
            _Log_.printCSTMessage("CST	for	program: Skipped due to	PARSE error(s)");
        };
        logger.prototype.printParseComplete = function () {
            var log = document.getElementById("outputTA");
            log.value += "Parse Completed" + "\n";
        };
        return logger;
    }());
    TSCompiler.logger = logger;
})(TSCompiler || (TSCompiler = {}));
