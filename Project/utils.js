///<reference path='globals.ts' />
///<reference path='lexer.ts' />
///<reference path='logger.ts' />
///<reference path='token.ts' />
///<reference path='sa.ts' />
///<reference path='ast.ts' />
///<reference path='symbol.ts' />
///<reference path='scope.ts' />
///<reference path='symbolTree.ts' />
///<reference path='node.ts' />
var TSCompiler;
(function (TSCompiler) {
    var utils = /** @class */ (function () {
        function utils() {
        }
        utils.compile = function () {
            // document.getElementById("outputTA").value = "";
            // document.getElementById("inputTA").value = "Enter Code Here...";
            // document.getElementById("cst_output").value = "";
            //test line
            //console.log("HERE");
            // Reset everything
            _Tokens_ = [];
            _CurrentT_ = null;
            _TokenIndex_ = 0;
            //_Scope_ [];
            _Lexer_ = new TSCompiler.lexer(); // We declared these in globals but still have 
            _Log_ = new TSCompiler.logger(); // to construct them before we can use them.
            _Parser_ = new TSCompiler.parse();
            _Tree_ = new TSCompiler.Tree();
            _AST_ = new TSCompiler.ast();
            _SA_ = new TSCompiler.sa();
            _codeGen_ = new TSCompiler.CodeGenerator();
            //_Symbol_ = new TSCompiler.Symbol();
            //_SymbolTree_ = new TSCompiler.symbolTree();
            var log = document.getElementById("outputTA");
            var cstLog = document.getElementById("cst_output");
            var astLog = document.getElementById("ast_output");
            var source = document.getElementById("inputTA");
            var table = document.getElementById("scope_output");
            source.value = this.trim(source.value);
            log.value = "";
            cstLog.value = "";
            astLog.value = "";
            table.nodeValue = "";
            _Log_.clearTable("scope_output");
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
        utils.leftPad = function (string, length) {
            if (string.length === 2) {
                return string;
            }
            for (var i = 1; i < length; i++) {
                string = "0" + string;
            }
            return string;
        };
        return utils;
    }());
    TSCompiler.utils = utils;
})(TSCompiler || (TSCompiler = {}));
