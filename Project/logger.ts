module TSCompiler{
    export class logger{

        public static printMessage(message: string): void{
            var log = <HTMLTextAreaElement> document.getElementById("outputTA");
            log.value += message + "\n";
        }
        public static printError(message: string, module: String, line: number): void{
            var log = <HTMLTextAreaElement> document.getElementById("outputTA");
            log.value += "ERROR: " + module + " Line: " + line + " --> " + message + "\n";
        }
        public static printWarning(message: string): void{
            var log = <HTMLTextAreaElement> document.getElementById("outputTA");
            log.value += "WARNING!!!: " + message + "\n";
        }
    }
}