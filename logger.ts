/// <reference path="globals.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>

module TSCompiler{
    export class logger{

        public printMessage(message: string): void{
            var log = <HTMLTextAreaElement> document.getElementById("outputTA");
            log.value += message + "\n";
        }
        public printError(message: string, module: String, line: number): void{
            var log = <HTMLTextAreaElement> document.getElementById("outputTA");
            log.value += "ERROR: " + module + " Line: " + line + " --> " + message + "\n";
        }
        public printWarning(message: string): void{
            var log = <HTMLTextAreaElement> document.getElementById("outputTA");
            log.value += "WARNING!!!: " + message + "\n";
        }
    }
}