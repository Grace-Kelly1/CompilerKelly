var TSCompiler;
(function (TSCompiler) {
    var StaticTable = /** @class */ (function () {
        function StaticTable() {
            this.items = [];
            this.prefix = "T";
            this.suffix = 0;
        }
        StaticTable.prototype.getCurrentTemp = function () {
            return this.prefix + this.suffix.toString();
        };
        StaticTable.prototype.getNextTemp = function () {
            this.suffix++;
            return this.prefix + this.suffix.toString();
        };
        StaticTable.prototype.getItems = function () {
            return this.items;
        };
        StaticTable.prototype.getItemAtIndex = function (index) {
            return this.items[index];
        };
        StaticTable.prototype.addItem = function (item) {
            this.items.push(item);
        };
        StaticTable.prototype.findItemWithIdentifier = function (id) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].getId() === id) {
                    return this.items[i];
                }
            }
        };
        StaticTable.prototype.incrementTemp = function () {
            this.suffix++;
        };
        StaticTable.prototype.getOffset = function () {
            return this.suffix;
        };
        StaticTable.prototype.getItemWithId = function (temp) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].getTemp() === temp) {
                    return this.items[i];
                }
            }
            return null;
        };
        StaticTable.prototype.removeTempsInCodeTable = function (codeTable) {
            var regex = /^(T[0-9])/;
            for (var i = 0; i < codeTable.table.length; i++) {
                var current = codeTable.table[i];
                if (current.match(regex)) {
                    var item = this.getItemWithId(current.match(regex)[1]);
                    console.log("current address");
                    console.log(codeTable.getCurrentAddress());
                    codeTable.addByteAtAddress((parseInt(item.getTemp()[1]) + codeTable.getCurrentAddress() + 1).toString(16), i.toString());
                    codeTable.addByteAtAddress("00", (i + 1).toString());
                }
            }
        };
        return StaticTable;
    }());
    TSCompiler.StaticTable = StaticTable;
    var StaticTableItem = /** @class */ (function () {
        function StaticTableItem(temp, id, scope, address, type) {
            this.address = 0;
            this.temp = temp;
            this.id = id;
            this.scope = scope;
            this.address = address;
            this.type = type;
        }
        StaticTableItem.prototype.getTemp = function () {
            return this.temp;
        };
        StaticTableItem.prototype.setTemp = function (temp) {
            this.temp = temp;
        };
        StaticTableItem.prototype.getId = function () {
            return this.id;
        };
        StaticTableItem.prototype.setId = function (id) {
            this.id = id;
        };
        StaticTableItem.prototype.getAddress = function () {
            return this.address;
        };
        StaticTableItem.prototype.getType = function () {
            return this.type;
        };
        return StaticTableItem;
    }());
    TSCompiler.StaticTableItem = StaticTableItem;
})(TSCompiler || (TSCompiler = {}));
