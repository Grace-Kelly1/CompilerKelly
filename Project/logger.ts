/// <reference path="globals.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>

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
            log.value = _CST_.toString();
        }

        public static printTokens(): void {
            var table = <HTMLTableElement> document.getElementById('token_output');
            for (var i = 0; i < _Tokens_.length; i++) {
                var row = <HTMLTableRowElement> table.insertRow(i + 1);
                var type  = <HTMLTableCellElement> row.insertCell(0);
                var value = <HTMLTableCellElement> row.insertCell(1);
                var line  = <HTMLTableCellElement> row.insertCell(2);
                type.innerHTML = _Tokens_[i].type;
                value.innerHTML = _Tokens_[i].value;
                line.innerHTML = _Tokens_[i].line;
            }
        }
    }
}