///<reference path='scope.ts' />
///<reference path='node.ts' />
///<reference path='globals.ts' />
///<reference path='utils.ts' />
///<reference path='logger.ts' />
///<reference path='sa.ts' />
///<reference path='codeTable.ts' />
///<reference path='codeGen.ts' />
///<reference path='jumpTable.ts' />

module TSCompiler {
    export class StaticTable {
        private items: StaticTableItem[] = [];
        private prefix: string = "T";
        private suffix: number = 0;
        
        public getCurrentTemp(): string {
            return this.prefix + this.suffix.toString();
        }
        
        public getNextTemp(): string {
            this.suffix++;
            return this.prefix + this.suffix.toString();
        }
        
        public getItems(): StaticTableItem[] {
            return this.items;
        }
        
        public getItemAtIndex(index: number): StaticTableItem {
            return this.items[index];
        }
        
        public addItem(item: StaticTableItem): void {
            this.items.push(item);
        }
        
        public findItemWithIdentifier(id: string): StaticTableItem {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].getId() === id) {
                    return this.items[i];
                }
            }
        }
        
        public incrementTemp() {
            this.suffix++;
        }
        
        public getOffset(): number {
            return this.suffix;
        }
        
        public getItemWithId(temp): StaticTableItem {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].getTemp() === temp) {
                    return this.items[i];
                }
            }
            return null;    
        }
        
        public removeTempsInCodeTable(codeTable: CodeTable): void {
            
            var regex = /^(T[0-9])/;
            for (var i = 0; i < codeTable.table.length; i++) {
                var current = codeTable.table[i];
                if (current.match(regex)) {
                    var item: StaticTableItem = this.getItemWithId(current.match(regex)[1]);
                    codeTable.addByteAtAddress((parseInt(item.getTemp()[1]) + codeTable.getCurrentAddress() + 1).toString(16), i.toString());
                    codeTable.addByteAtAddress("00", (i + 1).toString());
                }
            }
        }
    }
    
    export class StaticTableItem {
        private temp: string;
        private id: string;
        private scope: number;
        private address: number = 0;
        private type: string;
        
        constructor(temp: string, id: string, scope: number, address: number, type: string) {
            this.temp = temp;
            this.id = id;
            this.scope = scope; 
            this.address = address;
            this.type = type;
        }
        
        public getTemp(): string {
            return this.temp;
        }
        
        public setTemp(temp: string): void {
            this.temp = temp;
        }
        
        public getId(): string {
            return this.id;
        }
        
        public setId(id: string): void {
            this.id = id;
        }
        
        public getAddress(): number {
            return this.address;
        }
        
        public getType(): string {
            return this.type;
        }
    }
}