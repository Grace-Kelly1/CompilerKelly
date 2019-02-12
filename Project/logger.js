var TSCompiler;
(function (TSCompiler) {
    var logger = /** @class */ (function () {
        function logger() {
        }
        logger.printMessage = function (message) {
            var log = document.getElementById("outputTA");
            log.value += message + "\n";
        };
        logger.printError = function (message, module, line) {
            var log = document.getElementById("outputTA");
            log.value += "ERROR: " + module + " Line: " + line + " --> " + message + "\n";
        };
        logger.printWarning = function (message) {
            var log = document.getElementById("outputTA");
            log.value += "WARNING!!!: " + message + "\n";
        };
        return logger;
    }());
    TSCompiler.logger = logger;
})(TSCompiler || (TSCompiler = {}));
