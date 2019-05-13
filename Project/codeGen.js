///<reference path='scope.ts' />
///<reference path='node.ts' />
///<reference path='globals.ts' />
///<reference path='utils.ts' />
///<reference path='logger.ts' />
///<reference path='sa.ts' />
///<reference path='codeTable.ts' />
///<reference path='statictable.ts' />
///<reference path='jumpTable.ts' />
var TSCompiler;
(function (TSCompiler) {
    var CodeGenerator = /** @class */ (function () {
        function CodeGenerator() {
        }
        CodeGenerator.prototype.generateCode = function (node, scope) {
            _Log_.printMessage("\nBeginning Code Generation.");
            this.StaticTable = new TSCompiler.StaticTable();
            this.codeTable = new TSCompiler.CodeTable();
            this.jumpTable = new TSCompiler.JumpTable();
            this.generateCodeFromNode(node, scope);
            this["break"]();
            //need to fill empty spots with 00
            this.codeTable.zeroOutEmptySlots();
            this.StaticTable.removeTempsInCodeTable(this.codeTable);
            this.jumpTable.removeTempsInCodeTable(this.codeTable);
            _Log_.logCodeTable(this.codeTable);
            _Log_.printMessage("Code Generation complete.");
        };
        CodeGenerator.prototype.generateCodeFromNode = function (node, scope) {
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
        };
        CodeGenerator.prototype.generateCodeForBlock = function (node, scope) {
            for (var i = 0; i < node.children.length; i++) {
                console.log(node.children[i]);
                this.generateCodeFromNode(node.children[i], scope);
            }
        };
        CodeGenerator.prototype.generateCodeForWhileStatement = function (node, scope) {
            var current = this.codeTable.getCurrentAddress();
            this.generateCodeForBooleanExpression(node.children[0], scope);
            var jumpTemp = this.jumpTable.getNextTemp();
            var jumpItem = new TSCompiler.JumpTableItem(jumpTemp);
            this.jumpTable.addItem(jumpItem);
            this.branch(TSCompiler.utils.leftPad(this.codeTable.getCurrentAddress().toString(16), 2));
            console.log(node);
            this.generateCodeForBlock(node.children[1], scope);
            this.loadAccumulatorWithC("00");
            this.storeAccumulatorInMem("00", "00");
            this.loadXRegisterWithC("01");
            this.compareByte("00", "00");
            var toLeftPad = (256 - (this.codeTable.getCurrentAddress() - current + 2));
            var leftPadded = TSCompiler.utils.leftPad(toLeftPad.toString(16), 2);
            this.branch(leftPadded);
        };
        CodeGenerator.prototype.generateCodeForIfStatement = function (node, scope) {
            if (node.children[0].children[0].getIdentifier() && node.children[0].children[1].getIdentifier()) {
                var firstTableEntry = this.StaticTable.findItemWithIdentifier(node.children[0].children[0].getType());
                this.loadXRegisterFromMem(firstTableEntry.getTemp(), "XX");
                var secondTableEntry = this.StaticTable.findItemWithIdentifier(node.children[0].children[1].getType());
                this.compareByte(secondTableEntry.getTemp(), "XX");
                var jumpEntry = new TSCompiler.JumpTableItem(this.jumpTable.getCurrentTemp());
                this.jumpTable.addItem(jumpEntry);
                var start = this.codeTable.getCurrentAddress();
                this.branch(jumpEntry.getTemp());
                this.jumpTable.incrementTemp();
                this.generateCodeForBlock(node.children[1], scope);
                this.jumpTable.setDistanceForItem(jumpEntry, this.codeTable.getCurrentAddress() - start + 1);
            }
            else if (node.children.length === 1 && node.children[0].getType() === "true") {
                this.generateCodeForBlock(node.children[1], scope);
            }
        };
        //scope isnt used 
        CodeGenerator.prototype.generateCodeForPrintStatement = function (node, scope) {
            if (node.children[0].getIdentifier()) {
                var tableEntry = this.StaticTable.findItemWithIdentifier(node.children[0].getType());
                this.loadYRegisterFromMem(tableEntry.getTemp(), "XX");
                if (tableEntry.getType() === "int") {
                    this.loadXRegisterWithC("01");
                }
                else {
                    this.loadXRegisterWithC("02");
                }
                this.end();
            }
            else if (node.children[0].getInt()) {
                this.storeAccumulatorInMem("00", "00");
                this.loadXRegisterWithC("01");
                this.loadYRegisterFromMem("00", "00");
                this.end();
            }
            else if (node.children[0].checkBoolean()) {
            }
            else {
                // push to heap
                var heapPosition = this.codeTable.writeStringToHeap(node.children[0].getType());
                this.loadAccumulatorWithC(heapPosition.toString(16).toUpperCase());
                this.storeAccumulatorInMem("00", "00");
                this.loadXRegisterWithC("02");
                this.loadYRegisterFromMem("00", "00");
                //end
                this.end();
            }
        };
        CodeGenerator.prototype.generateCodeForVariableDeclaration = function (node, scope) {
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
        };
        CodeGenerator.prototype.generateCodeForBooleanExpression = function (node, scope) {
            console.log(node);
            switch (node.getType()) {
                case "==":
                    break;
                case "!=":
                    console.log("!=");
                    break;
                case "true":
                    console.log("true");
                    break;
                case "false":
                    this.loadXRegisterWithC("01");
                    this.loadAccumulatorWithC("00");
                    this.storeAccumulatorInMem("00", "00");
                    this.compareByte("00", "00");
                    break;
                default:
                    _Log_.printError("Undefined boolean type. Line: " + node.getLineNumber());
            }
        };
        CodeGenerator.prototype.generateCodeForIntDeclaration = function (node, scope) {
            this.loadAccumulatorWithC("00");
            this.storeAccumulatorInMem(this.StaticTable.getCurrentTemp(), "XX");
            var item = new TSCompiler.StaticTableItem(this.StaticTable.getCurrentTemp(), node.children[1].getType(), scope.getNameAsInt(), this.StaticTable.getOffset(), "int");
            this.StaticTable.addItem(item);
            this.StaticTable.incrementTemp();
        };
        CodeGenerator.prototype.generateCodeForStringDeclaration = function (node, scope) {
            var item = new TSCompiler.StaticTableItem(this.StaticTable.getNextTemp(), node.children[1].getType(), scope.getNameAsInt(), this.StaticTable.getOffset() + 1, "string");
            this.StaticTable.addItem(item);
        };
        CodeGenerator.prototype.generateCodeForBooleanDeclaration = function (node, scope) {
            var item = new TSCompiler.StaticTableItem(this.StaticTable.getCurrentTemp(), node.children[1].getType(), scope.getNameAsInt(), this.StaticTable.getOffset(), "boolean");
            this.StaticTable.addItem(item);
            this.StaticTable.incrementTemp();
        };
        //scope not used 
        CodeGenerator.prototype.generateCodeForAssignmentStatement = function (node, scope) {
            if (node.children[1].getIdentifier()) {
                var firstTableEntry = this.StaticTable.findItemWithIdentifier(node.children[1].getType());
                var secondTableEntry = this.StaticTable.findItemWithIdentifier(node.children[0].getType());
                this.loadAccumulatorFromMem(firstTableEntry.getTemp(), "XX");
                this.storeAccumulatorInMem(secondTableEntry.getTemp(), "XX");
            }
            else if (node.children[1].getInt()) {
                var tableEntry = this.StaticTable.findItemWithIdentifier(node.children[0].getType());
                var value = TSCompiler.utils.leftPad(node.children[1].getType(), 2);
                this.loadAccumulatorWithC(value);
                this.storeAccumulatorInMem(tableEntry.getTemp(), "XX");
            }
            else if (node.children[1].checkBoolean()) {
            }
            else {
                var entry = this.StaticTable.findItemWithIdentifier(node.children[0].getType());
                var pointer = this.codeTable.writeStringToHeap(node.children[1].getType());
                this.loadAccumulatorWithC(pointer.toString(16).toUpperCase());
                this.storeAccumulatorInMem(entry.getTemp(), "XX");
            }
        };
        //end
        CodeGenerator.prototype.end = function () {
            this.codeTable.addByte('FF');
        };
        CodeGenerator.prototype.loadAccumulatorWithC = function (constant) {
            this.codeTable.addByte('A9');
            this.codeTable.addByte(constant);
        };
        CodeGenerator.prototype.loadAccumulatorFromMem = function (atAddress, fromAddress) {
            console.log("HERE For Mem");
            this.codeTable.addByte('AD');
            this.codeTable.addByte(atAddress);
            this.codeTable.addByte(fromAddress);
        };
        CodeGenerator.prototype.storeAccumulatorInMem = function (atAddress, fromAddress) {
            this.codeTable.addByte('8D');
            this.codeTable.addByte(atAddress);
            this.codeTable.addByte(fromAddress);
        };
        CodeGenerator.prototype.addWithCarry = function (atAddress, fromAddress) {
            this.codeTable.addByte('6D');
            this.codeTable.addByte(atAddress);
            this.codeTable.addByte(fromAddress);
        };
        CodeGenerator.prototype.loadXRegisterWithC = function (constant) {
            this.codeTable.addByte('A2');
            this.codeTable.addByte(constant);
        };
        CodeGenerator.prototype.loadXRegisterFromMem = function (atAddress, fromAddress) {
            this.codeTable.addByte('AE');
            this.codeTable.addByte(atAddress);
            this.codeTable.addByte(fromAddress);
        };
        CodeGenerator.prototype.loadYRegisterWithC = function (constant) {
            this.codeTable.addByte('A0');
            this.codeTable.addByte(constant);
        };
        CodeGenerator.prototype.loadYRegisterFromMem = function (atAddress, fromAddress) {
            this.codeTable.addByte('AC');
            this.codeTable.addByte(atAddress);
            this.codeTable.addByte(fromAddress);
        };
        CodeGenerator.prototype["break"] = function () {
            this.codeTable.addByte('00');
        };
        CodeGenerator.prototype.compareByte = function (atAddress, fromAddress) {
            this.codeTable.addByte('EC');
            this.codeTable.addByte(atAddress);
            this.codeTable.addByte(fromAddress);
        };
        CodeGenerator.prototype.branch = function (comparisonByte) {
            this.codeTable.addByte('D0');
            this.codeTable.addByte(comparisonByte);
        };
        return CodeGenerator;
    }());
    TSCompiler.CodeGenerator = CodeGenerator;
})(TSCompiler || (TSCompiler = {}));
