var TSCompiler;
(function (TSCompiler) {
    var CodeTable = /** @class */ (function () {
        function CodeTable() {
            this.table = [];
            this.currentAddress = 0;
            this.heapPosition = 255;
            for (var i = 0; i < 256; i++) {
                this.table[i] = "";
            }
        }
        CodeTable.prototype.addByte = function (byte) {
            this.table[this.currentAddress] = byte;
            this.currentAddress++;
        };
        CodeTable.prototype.addByteAtAddress = function (byte, address) {
            byte = byte.toUpperCase();
            this.table[address] = byte;
        };
        CodeTable.prototype.getCurrentAddress = function () {
            return this.currentAddress;
        };
        CodeTable.prototype.toString = function () {
            var output = "";
            for (var i = 0; i < this.table.length; i++) {
                output += this.table[i] + " ";
            }
            return output.trim();
        };
        CodeTable.prototype.zeroOutEmptySlots = function () {
            for (var i = 0; i < 256; i++) {
                if (this.table[i] === "") {
                    this.table[i] = "00";
                }
            }
        };
        CodeTable.prototype.writeStringToHeap = function (string) {
            var start;
            this.addByteAtAddress("00", this.heapPosition.toString());
            this.heapPosition--;
            for (var i = string.length - 1; i >= 0; i--) {
                start = this.heapPosition;
                var hex = string.charCodeAt(i).toString(16);
                this.addByteAtAddress(hex, this.heapPosition.toString());
                this.heapPosition--;
            }
            return start;
        };
        return CodeTable;
    }());
    TSCompiler.CodeTable = CodeTable;
    var CodeTableItem = /** @class */ (function () {
        function CodeTableItem() {
        }
        return CodeTableItem;
    }());
    TSCompiler.CodeTableItem = CodeTableItem;
})(TSCompiler || (TSCompiler = {}));
