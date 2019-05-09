module TSCompiler {
    export class JumpTable {
        private items: JumpTableItem[] = [];
        private prefix: string = "J";
        private suffix: number = 0;
        
        public getCurrentTemp(): string {
            return this.prefix + this.suffix.toString();
        }
        
        public getNextTemp(): string {
            this.suffix++;
            return this.prefix + this.suffix.toString();
        }
        
        public getItems(): JumpTableItem[] {
            return this.items;
        }
        
        public getItemAtIndex(index: number): JumpTableItem {
            return this.items[index];
        }
        
        public addItem(item: JumpTableItem): void {
            this.items.push(item);
        }
        
        public incrementTemp(): void {
            this.suffix++;
        }
        
        public getItemWithId(temp): JumpTableItem {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].getTemp() === temp) {
                    return this.items[i];
                }
            }
            return null;
        }
        
        public removeTempsInCodeTable(codeTable: CodeTable): void {
            var regex = /^(J[0-9])/;
            for (var i = 0; i < codeTable.table.length; i++) {
                var current = codeTable.table[i];
                //console.log(current.match(regex));
                if (current.match(regex)) {
                    var item: JumpTableItem = this.getItemWithId(current.match(regex)[1]);
                    
                    codeTable.addByteAtAddress(utils.leftPad(item.getDistance().toString(16), 2), i.toString());
                }
            }
        }
        
        public setDistanceForItem(item: JumpTableItem, distance: number) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i] === item) {
                    this.items[i].setDistance(distance);
                }
            }
        }
    }
    
    export class JumpTableItem {
        private temp: string;
        private distance: number;
        
        constructor(temp: string) {
            this.temp = temp;
            this.distance = 0;
        }
        
        public getTemp(): string {
            return this.temp;
        }
        
        public setTemp(temp: string): void {
            this.temp = temp;
        }
        
        public getDistance(): number {
            return this.distance;
        }
        
        public setDistance(distance: number): void {
            this.distance = distance;
        }
    }
}