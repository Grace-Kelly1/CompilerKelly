///<reference path='globals.ts' />
///<reference path='lexer.ts' />
///<reference path='logger.ts' />
///<reference path='token.ts' />

module TSCompiler{
    export class utils{

        public static compile() {
            //test line
            //console.log("HERE");

            // Reset everything
            //_Tokens_ = [];
            _CurrentT_ = null;
            _TokenIndex_ = 0;
            _Lexer_ = new TSCompiler.lexer();  // We declared these in globals but still have 
                _Log_   = new TSCompiler.logger(); // to construct them before we can use them.
                

            var log: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("outputTA");
            var source: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("inputTA");
            source.value = this.trim(source.value);
            log.value = "";

            if (source.value === '') {
                _Log_.printMessage("Empty TextArea");
                return;
            }
            _Lexer_.lexerCode();

            _Log_.printMessage("Lex analysis complete.");

        }

        // Used in some places but specifically typed out in others. (TODO: Be consistent about this.)
        public static trim(words) {
            return words.replace(/^\s+ | \s+$/g, "");
        }
    }
}