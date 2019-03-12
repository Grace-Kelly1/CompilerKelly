/// <reference path="globals.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="Tree.ts"/>

module TSCompiler{
    export class logger{

        public printMessage(message: string): void{
            var log = <HTMLTextAreaElement> document.getElementById("outputTA");
            log.value += message + "\n";
        }
        public printError(message: string): void{
            var log = <HTMLTextAreaElement> document.getElementById("outputTA");
            log.value += "ERROR: " + message + "\n";
        }
        public printWarning(message: string): void{
            var log = <HTMLTextAreaElement> document.getElementById("outputTA");
            log.value += "WARNING!!!: " + message + "\n";
        }

        public printCST(): void {
            var log = <HTMLTextAreaElement> document.getElementById('cst_output');
            //Print code not tree???
            //_Tree_ = new TSCompiler.Tree();
            log.value += _Tree_.toString();
        }

        public printCSTMessage(message: string): void{
            var log = <HTMLTextAreaElement> document.getElementById('cst_output');
            log.value += message + "\n";
        }

        public printParseMessage(message: string): void{
            var log = <HTMLTextAreaElement> document.getElementById("outputTA");
            log.value += message + "\n";
        }

        public printParseError(message: string): void{
            var log = <HTMLTextAreaElement> document.getElementById("outputTA");
            log.value += "ERROR: " + message + "\n";
            _Log_.printCSTMessage("CST	for	program: Skipped due to	PARSE error(s)");
        }

        public printParseComplete(){
            var log = <HTMLTextAreaElement> document.getElementById("outputTA");
            log.value += "Parse Completed" + "\n";
        }
    }
}