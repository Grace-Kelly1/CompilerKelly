///<reference path='globals.ts' />
///<reference path='lexer.ts' />
///<reference path='token.ts' />
///<reference path='logger.ts' />
var TSCompiler;
(function (TSCompiler) {
    var utils = /** @class */ (function () {
        function utils() {
        }
        utils.compile = function () {
            //test line
            //console.log("HERE");
            // Reset everything
            _Tokens_ = [];
            _CurrentT_ = null;
            _TokenIndex_ = 0;
            var log = document.getElementById("outputTA");
            var source = document.getElementById("inputTA");
            source.value = this.trim(source.value);
            log.value = "";
            if (source.value === '') {
                _Log_.printMessage("Empty Textarea");
                return;
            }
            _Lexer_.lexerCode();
            _Log_.printMessage("Lex analysis successful");
        };
        //used in some places but specifically typed out in others 
        utils.trim = function (words) {
            return words.replace(/^\s+ | \s+$/g, "");
        };
        return utils;
    }());
    TSCompiler.utils = utils;
})(TSCompiler || (TSCompiler = {}));
