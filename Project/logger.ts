/// <reference path="globals.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="Tree.ts"/>
/// <reference path="symbolTree.ts"/>
/// <reference path="ast.ts"/>
/// <reference path="symbol.ts"/>
/// <reference path="scope.ts"/>


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

        public printAST(output: string): void {
            var log = <HTMLTextAreaElement> document.getElementById('ast_output');
            //Print code not tree???
            //_Tree_ = new TSCompiler.Tree();
            console.log("Trying to print ast")
            log.value = output;
        }

        public printCSTMessage(message: string): void{
            var log = <HTMLTextAreaElement> document.getElementById('cst_output');
            log.value += message + "\n";
        }

        public printASTMessage(message: string): void{
            var log = <HTMLTextAreaElement> document.getElementById('ast_output');
            log.value += message + "\n";
        }

        public printParseMessage(message: string): void{
            var log = <HTMLTextAreaElement> document.getElementById("outputTA");
            log.value += message + "\n";
        }

        public printParseError(message: string): void{
            var log = <HTMLTextAreaElement> document.getElementById("outputTA");
            log.value += "ERROR: " + message + "\n";
        }

        public printParseComplete(){
            var log = <HTMLTextAreaElement> document.getElementById("outputTA");
            log.value += "Parse Completed" + "\n";
        }

        public printSAMessage(message: string): void{
            var log = <HTMLTextAreaElement> document.getElementById("outputTA");
            log.value += message + "\n";
        }

        public printSAError(message: string): void{
            var log = <HTMLTextAreaElement> document.getElementById("outputTA");
            log.value += "ERROR: " + message + "\n";
        }

        public printSAComplete(){
            var log = <HTMLTextAreaElement> document.getElementById("outputTA");
            log.value += "Parse Completed" + "\n";
        }

        public logTokens(): void {
            var table = <HTMLTableElement> document.getElementById("token_output");
            for (var i = 0; i < _Tokens_.length; i++) {
                // Use i + 1 to keep the header on top
                var row = <HTMLTableRowElement> table.insertRow(i + 1);
                var type  = <HTMLTableCellElement> row.insertCell(0);
                var value = <HTMLTableCellElement> row.insertCell(1);
                var line  = <HTMLTableCellElement> row.insertCell(2);

                type.innerHTML = _Tokens_[i].type;
                value.innerHTML = _Tokens_[i].value;
                line.innerHTML = _Tokens_[i].line;
            }
        }

        public printSymbolTable(symbolTable: Scope[]): void {
            console.log("Printing");
            for (var i = 0; i < symbolTable.length; i++) {
                this.printScope(symbolTable[i]);
            }
        }

        public printScope(scope: Scope): void {
            var table = <HTMLTableElement> document.getElementById("scope_output");
            var unusedSymbols: Symbol[] = [];
            console.log("Symbol Length " + scope.getSymbols().length);
            for (var i = 0; i < scope.getSymbols().length; i++) {
                var symbols = scope.getSymbols();

                var row = <HTMLTableRowElement> table.insertRow(i + 1);
                var name  = <HTMLTableCellElement> row.insertCell(0);
                var type  = <HTMLTableCellElement> row.insertCell(1);
                var level = <HTMLTableCellElement> row.insertCell(2);
                var line  = <HTMLTableCellElement> row.insertCell(3);
                name.innerHTML = symbols[i].getName();
                type.innerHTML = symbols[i].getType();
                level.innerHTML = scope.getName();
                line.innerHTML = symbols[i].getLine();

                if (!symbols[i].getInitialized()) {
                    unusedSymbols.push(symbols[i]);
                }
            }
        }

        public clearTable(element: string) {
            var table = <HTMLTableElement> document.getElementById(element);
            var length = table.rows.length;

            if (length > 1) {
                // Remove rows from the bottom up
                // Otherwise, they'll be removed out of order or some will be skipped
                for (var i = length - 1; i > 0; i--) {
                    table.deleteRow(i);
                }
            }
        }

        public logCodeTable(codeTable: CodeTable) {
            var log = <HTMLTextAreaElement> document.getElementById('codeG_output');
            log.value = codeTable.toString();
        }
    }
}