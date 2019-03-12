///<reference path='globals.ts' />
///<reference path='lexer.ts' />
///<reference path='logger.ts' />
///<reference path='token.ts' />
var TSCompiler;
(function (TSCompiler) {
    var utils = /** @class */ (function () {
        function utils() {
        }
        utils.compile = function () {
            //test line
            //console.log("HERE");
            // Reset everything
            //_Tokens_ = [];
            _CurrentT_ = null;
            _TokenIndex_ = 0;
            _Lexer_ = new TSCompiler.lexer(); // We declared these in globals but still have 
            _Log_ = new TSCompiler.logger(); // to construct them before we can use them.
            _Parser_ = new TSCompiler.parse();
            _Tree_ = new TSCompiler.Tree();
            var log = document.getElementById("outputTA");
            var cstLog = document.getElementById("cst_output");
            var source = document.getElementById("inputTA");
            source.value = this.trim(source.value);
            log.value = "";
            cstLog.value = "";
            if (source.value === '') {
                _Log_.printMessage("Empty TextArea");
                return;
            }
            _Lexer_.lexerCode();
            // while (_TokenIndex_ < _Tokens_.length) {
            //     _Parser_.parse();
            //     _Log_.printMessage("Completed parsing program.");
            // }
            // _Log_.printCST();
        };
        // Used in some places but specifically typed out in others. (TODO: Be consistent about this.)
        utils.trim = function (words) {
            return words.replace(/^\s+ | \s+$/g, "");
        };
        return utils;
    }());
    TSCompiler.utils = utils;
})(TSCompiler || (TSCompiler = {}));
