module TSCompiler{
    export class log{
        public static printMessage(message: string): void{
            var log = <HTMLTextAreaElement> document.getElementById("output");
            log.value += message + "\n";
        }
        public static printError(message: string, module: String, line: number): void{
            var log = <HTMLTextAreaElement> document.getElementById("output");
            log.value += "ERROR: " + module + " Line: " + line + " --> " + message + "\n";
        }
        public static printWarning(message: string): void{
            var log = <HTMLTextAreaElement> document.getElementById("output");
            log.value += "WARNING!!!: " + message + "\n";
        }
    }
}