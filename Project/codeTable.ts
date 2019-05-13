///<reference path='scope.ts' />
///<reference path='node.ts' />
///<reference path='globals.ts' />
///<reference path='utils.ts' />
///<reference path='logger.ts' />
///<reference path='sa.ts' />
///<reference path='codeGen.ts' />
///<reference path='statictable.ts' />
///<reference path='jumpTable.ts' />

module TSCompiler {
    export class CodeTable {
        public table: string[] = [];
        private currentAddress: number = 0;
        private heapPosition: number = 255;
        
        constructor() {
            for (var i = 0; i < 256; i++) {
                this.table[i] = "";
            }
        }
        
        public addByte(byte: string): void {
            this.table[this.currentAddress] = byte;
            this.currentAddress++;
        }
        
        public addByteAtAddress(byte: string, address: string): void {
            byte = byte.toUpperCase();
            this.table[address] = byte;
        }
        
        public getCurrentAddress(): number {
            return this.currentAddress;
        }
        
        public toString(): string {
            var output: string = "";
            for (var i = 0; i < this.table.length; i++) {
                output += this.table[i] + " ";
            }
            return output.trim();
        }
        
        public zeroOutEmptySlots(): void {
            for (var i = 0; i < 256; i++) {
                if (this.table[i] === "") {
                    this.table[i] = "00";
                }
            }
        }
        
        public writeStringToHeap(string: string): number {
            var start: number;
            this.addByteAtAddress("00", this.heapPosition.toString());
            this.heapPosition--;
            
            for (var i = string.length - 1; i >= 0; i--) {
                start = this.heapPosition;
                var hex = string.charCodeAt(i).toString(16);
                this.addByteAtAddress(hex, this.heapPosition.toString());
                this.heapPosition--;
            }
            
            return start;
        }
    }
    
    export class CodeTableItem {
        
    }
}