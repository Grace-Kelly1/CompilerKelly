///<reference path='globals.ts' />
module TSCompiler{
    export class utils{
        public static compile() {
            //test line
            //console.log("YES");
            // Reset everything
            _Tokens_ = [];
            _CurrentT_ = null;
            _TokenIndex_ = 0;
            var output: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("output");
            var inputCode: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("intput_Code");
            inputCode.value = this.trim(inputCode.value);
            output.value = "";

            if (inputCode.value === '') {
                //console.log("YES");
                _Log_.printMessage("Empty!!");
            }
            _Lexer_.lexerCode();
            _Log_.printMessage("Lex successful");
        }
        //used in some places but specifically typed out in others 
        public static trim(words)      
        {
            return words.replace(/^\s+ | \s+$/g, "");
        }
    }
}