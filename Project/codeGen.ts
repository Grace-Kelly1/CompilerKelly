    
///<reference path='codeTable.ts' />
///<reference path='staticTable.ts' />
///<reference path='jumpTable.ts' />
///<reference path='scope.ts' />
///<reference path='node.ts' />
///<reference path='globals.ts' />
///<reference path='utils.ts' />
///<reference path='logger.ts' />
///<reference path='sa.ts' />
///<reference path='codeTable.ts' />
///<reference path='statictable.ts' />
///<reference path='jumpTable.ts' />

module TSCompiler {
    export class CodeGenerator {
        
        private  StaticTable: StaticTable;
        private  codeTable: CodeTable;
        private  jumpTable: JumpTable;
        
        public  generateCode(node: Node, scope: Scope){
            _Log_.printMessage("\nBeginning Code Generation.");
            this.StaticTable = new StaticTable();
            this.codeTable = new CodeTable();
            this.jumpTable = new JumpTable();
            this.generateCodeFromNode(node, scope);
            this.break();
            this.codeTable.zeroOutEmptySlots();
            this.StaticTable.removeTempsInCodeTable(this.codeTable);
            this.jumpTable.removeTempsInCodeTable(this.codeTable);
            _Log_.logCodeTable(this.codeTable);
            _Log_.printMessage("Code Generation complete.");
        }
        
        public  generateCodeFromNode(node: Node, scope: Scope){
            _Log_.printMessage("Generating code for " + node.getType());
            console.log(node);
            switch (node.getType()) {
                case "Block":
                    this.generateCodeForBlock(node, scope);
                    break;
                case "While Statement":
                    this.generateCodeForWhileStatement(node, scope);
                    break;
                case "If Statement":
                    console.log(node); 
                    this.generateCodeForIfStatement(node, scope);
                    break;
                case "Print Statement":
                    this.generateCodeForPrintStatement(node, scope);
                    break;
                case "Variable Declaration":
                    this.generateCodeForVariableDeclaration(node, scope);
                    break;
                case "Assignment Statement":
                    this.generateCodeForAssignmentStatement(node, scope);
                    break; 
                default:
                    _Log_.printError("Node has unidentified type. Line: " + node.getLineNumber());   
            }   
        }
        
        public  generateCodeForBlock(node: Node, scope: Scope){
            for (var i = 0; i < node.children.length; i++) {
                console.log(node.children[i]);
                this.generateCodeFromNode(node.children[i], scope);
            }
        }
        
        public  generateCodeForWhileStatement(node: Node, scope: Scope){
            var current = this.codeTable.getCurrentAddress();
            this.generateCodeForBooleanExpression(node.children[0], scope);
            
            var jumpTemp = this.jumpTable.getNextTemp();
            var jumpItem = new JumpTableItem(jumpTemp);
            this.jumpTable.addItem(jumpItem);
            this.branch(utils.leftPad(this.codeTable.getCurrentAddress().toString(16), 2));

            console.log(node);
            this.generateCodeForBlock(node.children[1], scope);
            
            this.loadAccumulatorWithConstant("00");
            this.storeAccumulatorInMemory("00", "00");
            this.loadXRegisterWithConstant("01");
            this.compareByte("00", "00");
            
            var toLeftPad = (256 - (this.codeTable.getCurrentAddress() - current + 2));
            var leftPadded = utils.leftPad(toLeftPad.toString(16), 2);
            this.branch(leftPadded);
        }
        
        public  generateCodeForIfStatement(node: Node, scope: Scope){   
              
            if (node.children[0].children[0].getIdentifier() && node.children[0].children[1].getIdentifier()) {
                console.log(node);
                var firstTableEntry = this.StaticTable.findItemWithIdentifier(node.children[0].children[0].getType());
                this.loadXRegisterFromMemory(firstTableEntry.getTemp(), "XX");
            
                var secondTableEntry = this.StaticTable.findItemWithIdentifier(node.children[0].children[1].getType());
            
                this.compareByte(secondTableEntry.getTemp(), "XX");
                
                var jumpEntry = new JumpTableItem(this.jumpTable.getCurrentTemp());
                this.jumpTable.addItem(jumpEntry);
                var start = this.codeTable.getCurrentAddress();
                this.branch(jumpEntry.getTemp());
                this.jumpTable.incrementTemp();
                this.generateCodeForBlock(node.children[1], scope);
                console.log(this.codeTable.getCurrentAddress() - start + 1);
                this.jumpTable.setDistanceForItem(jumpEntry, this.codeTable.getCurrentAddress() - start + 1)
            } else if (node.children.length === 1 && node.children[0].getType() === "true") {
                this.generateCodeForBlock(node.children[1], scope);
            }
            
        }
        
        public  generateCodeForPrintStatement(node: Node, scope: Scope){
            console.log(node);
            if (node.children[0].getIdentifier()) {
                var tableEntry = this.StaticTable.findItemWithIdentifier(node.children[0].getType());
                this.loadYRegisterFromMemory(tableEntry.getTemp(), "XX");
                
                if (tableEntry.getType() === "int") {
                    this.loadXRegisterWithConstant("01");
                } else {
                    this.loadXRegisterWithConstant("02");
                }
                
                this.systemCall();
            } else if (node.children[0].getInt()) {
                this.generateCodeForIntExpression(node.children[0], scope);
                this.storeAccumulatorInMemory("00", "00");
                this.loadXRegisterWithConstant("01");
                this.loadYRegisterFromMemory("00", "00");
                this.systemCall();
            } else if (node.children[0].checkBoolean()) {
                
            } else {
                // write it to the heap
                var heapPosition = this.codeTable.writeStringToHeap(node.children[0].getType());
                this.loadAccumulatorWithConstant(heapPosition.toString(16).toUpperCase());
                this.storeAccumulatorInMemory("00", "00");
                this.loadXRegisterWithConstant("02");
                this.loadYRegisterFromMemory("00", "00");
                this.systemCall();
            }            
        }
        
        public  generateCodeForVariableDeclaration(node: Node, scope: Scope){
            switch (node.children[0].getType()) {
                case "int":
                    this.generateCodeForIntDeclaration(node, scope);
                    break;
                case "boolean":
                    this.generateCodeForBooleanDeclaration(node, scope);
                    break;
                case "string":
                    this.generateCodeForStringDeclaration(node, scope);
                    break;
                default:
                    _Log_.printError("Variable type undefined. Line: " + node.getLineNumber());
            }
        }
        
        public  generateCodeForIntDeclaration(node: Node, scope: Scope){
            this.loadAccumulatorWithConstant("00");
            this.storeAccumulatorInMemory(this.StaticTable.getCurrentTemp(), "XX");
            var item = new StaticTableItem(this.StaticTable.getCurrentTemp(), node.children[1].getType(), scope.getNameAsInt(), this.StaticTable.getOffset(), "int");
            this.StaticTable.addItem(item);
            this.StaticTable.incrementTemp();
        }
        
        public  generateCodeForStringDeclaration(node: Node, scope: Scope){
            
            var item = new StaticTableItem(this.StaticTable.getNextTemp(), node.children[1].getType(), scope.getNameAsInt(), this.StaticTable.getOffset() + 1, "string");
            this.StaticTable.addItem(item);
        }
        
        public  generateCodeForBooleanDeclaration(node: Node, scope: Scope){
            var item = new StaticTableItem(this.StaticTable.getCurrentTemp(), node.children[1].getType(), scope.getNameAsInt(), this.StaticTable.getOffset(), "boolean");
            this.StaticTable.addItem(item);
            this.StaticTable.incrementTemp();
        }
        
        public  generateCodeForBooleanExpression(node: Node, scope: Scope) {
            console.log(node);
            switch (node.getType()) {
                case "==":
                    console.log("==");
                    this.generateCodeForEquivalencyStatement(node, scope);
                    break;
                case "!=":
                    console.log("!=");
                    break;
                case "true":
                    console.log("true");
                    break;
                case "false":
                    this.loadXRegisterWithConstant("01");
                    this.loadAccumulatorWithConstant("00");
                    this.storeAccumulatorInMemory("00", "00");
                    this.compareByte("00", "00");
                    break;
                default:
                    _Log_.printError("Undefined boolean type. Line: " + node.getLineNumber());
            }
        }
        
        public  generateCodeForAssignmentStatement(node: Node, scope: Scope){
            console.log(node);
            if (node.children[1].getIdentifier()) {
                var firstTableEntry = this.StaticTable.findItemWithIdentifier(node.children[1].getType());
                var secondTableEntry = this.StaticTable.findItemWithIdentifier(node.children[0].getType())
                this.loadAccumulatorFromMemory(firstTableEntry.getTemp(), "XX");
                this.storeAccumulatorInMemory(secondTableEntry.getTemp(), "XX");
            } else if (node.children[1].getInt()) {  
                var tableEntry = this.StaticTable.findItemWithIdentifier(node.children[0].getType());
                var value = utils.leftPad(node.children[1].getType(), 2);
            
                this.loadAccumulatorWithConstant(value);
                this.storeAccumulatorInMemory(tableEntry.getTemp(), "XX"); 
            } else if (node.children[1].checkBoolean()) {   
            } else {
                var entry = this.StaticTable.findItemWithIdentifier(node.children[0].getType());

                var pointer = this.codeTable.writeStringToHeap(node.children[1].getType());
                this.loadAccumulatorWithConstant(pointer.toString(16).toUpperCase());
                
                this.storeAccumulatorInMemory(entry.getTemp(), "XX");
            }
        }
        
        public  generateCodeForEquivalencyStatement(node: Node, scope: Scope){
            
        }
        
        public  generateCodeForIntExpression(node: Node, scope: Scope){
            
        }
        
        public  loadAccumulatorWithConstant(constant: string){
            this.codeTable.addByte('A9');
            this.codeTable.addByte(constant);
        }
        
        public  loadAccumulatorFromMemory(atAddress: string, fromAddress: string){
            this.codeTable.addByte('AD');
            this.codeTable.addByte(atAddress);
            this.codeTable.addByte(fromAddress);
        }
        
        public  storeAccumulatorInMemory(atAddress: string, fromAddress: string){
            this.codeTable.addByte('8D');
            this.codeTable.addByte(atAddress);
            this.codeTable.addByte(fromAddress);
        }
        
        public  addWithCarry(atAddress: string, fromAddress: string){
            this.codeTable.addByte('6D');
            this.codeTable.addByte(atAddress);
            this.codeTable.addByte(fromAddress);
        }
        
        public  loadXRegisterWithConstant(constant: string){
            this.codeTable.addByte('A2');
            this.codeTable.addByte(constant);
        }
        
        public  loadXRegisterFromMemory(atAddress: string, fromAddress: string){
            this.codeTable.addByte('AE');
            this.codeTable.addByte(atAddress);
            this.codeTable.addByte(fromAddress);
        }
        
        public  loadYRegisterWithConstant(constant: string){
            this.codeTable.addByte('A0');
            this.codeTable.addByte(constant);
        }
        
        public  loadYRegisterFromMemory(atAddress: string, fromAddress: string){
            this.codeTable.addByte('AC');
            this.codeTable.addByte(atAddress);
            this.codeTable.addByte(fromAddress);
        }
        
        public  noOperation(){
            this.codeTable.addByte('EA');
        }
        
        public  break(){
            this.codeTable.addByte('00');
        }
        
        public  compareByte(atAddress: string, fromAddress: string){
            this.codeTable.addByte('EC');
            this.codeTable.addByte(atAddress);
            this.codeTable.addByte(fromAddress);
        }
        
        public  branch(comparisonByte: string){
            this.codeTable.addByte('D0');
            this.codeTable.addByte(comparisonByte)
        }
        
        
        public  systemCall(){
            this.codeTable.addByte('FF');
        }
    }
}