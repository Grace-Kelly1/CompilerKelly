var TSCompiler;
(function (TSCompiler) {
    var log = /** @class */ (function () {
        function log() {
        }
        log.printMessage = function (message) {
            var log = document.getElementById("output");
            log.value += message + "\n";
        };
        log.printError = function (message, module, line) {
            var log = document.getElementById("output");
            log.value += "ERROR: " + module + " Line: " + line + " --> " + message + "\n";
        };
        log.printWarning = function (message) {
            var log = document.getElementById("output");
            log.value += "WARNING!!!: " + message + "\n";
        };
        return log;
    }());
    TSCompiler.log = log;
})(TSCompiler || (TSCompiler = {}));
