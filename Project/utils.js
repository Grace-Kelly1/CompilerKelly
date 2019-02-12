///<reference path='globals.ts' />
var TSCompiler;
(function (TSCompiler) {
    var utils = /** @class */ (function () {
        function utils() {
        }
        utils.compile = function () {
            //test line
            //console.log("YES");
            // Reset everything
            _Tokens_ = [];
            _CurrentT_ = null;
            _TokenIndex_ = 0;
            var output = document.getElementById("output");
            var inputCode = document.getElementById("intput_Code");
            inputCode.value = this.trim(inputCode.value);
            output.value = "";
            if (inputCode.value === '') {
                //console.log("YES");
                _Log_.printMessage("Empty!!");
            }
            _Lexer_.lexerCode();
            _Log_.printMessage("Lex successful");
        };
        //used in some places but specifically typed out in others 
        utils.trim = function (words) {
            return words.replace(/^\s+ | \s+$/g, "");
        };
        return utils;
    }());
    TSCompiler.utils = utils;
})(TSCompiler || (TSCompiler = {}));
