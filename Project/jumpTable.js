var TSCompiler;
(function (TSCompiler) {
    var JumpTable = /** @class */ (function () {
        function JumpTable() {
            this.items = [];
            this.prefix = "J";
            this.suffix = 0;
        }
        JumpTable.prototype.getCurrentTemp = function () {
            return this.prefix + this.suffix.toString();
        };
        JumpTable.prototype.getNextTemp = function () {
            this.suffix++;
            return this.prefix + this.suffix.toString();
        };
        JumpTable.prototype.getItems = function () {
            return this.items;
        };
        JumpTable.prototype.getItemAtIndex = function (index) {
            return this.items[index];
        };
        JumpTable.prototype.addItem = function (item) {
            this.items.push(item);
        };
        JumpTable.prototype.incrementTemp = function () {
            this.suffix++;
        };
        JumpTable.prototype.getItemWithId = function (temp) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].getTemp() === temp) {
                    return this.items[i];
                }
            }
            return null;
        };
        JumpTable.prototype.removeTempsInCodeTable = function (codeTable) {
            var regex = /^(J[0-9])/;
            for (var i = 0; i < codeTable.table.length; i++) {
                var current = codeTable.table[i];
                //console.log(current.match(regex));
                if (current.match(regex)) {
                    var item = this.getItemWithId(current.match(regex)[1]);
                    codeTable.addByteAtAddress(TSCompiler.utils.leftPad(item.getDistance().toString(16), 2), i.toString());
                }
            }
        };
        JumpTable.prototype.setDistanceForItem = function (item, distance) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i] === item) {
                    this.items[i].setDistance(distance);
                }
            }
        };
        return JumpTable;
    }());
    TSCompiler.JumpTable = JumpTable;
    var JumpTableItem = /** @class */ (function () {
        function JumpTableItem(temp) {
            this.temp = temp;
            this.distance = 0;
        }
        JumpTableItem.prototype.getTemp = function () {
            return this.temp;
        };
        JumpTableItem.prototype.setTemp = function (temp) {
            this.temp = temp;
        };
        JumpTableItem.prototype.getDistance = function () {
            return this.distance;
        };
        JumpTableItem.prototype.setDistance = function (distance) {
            this.distance = distance;
        };
        return JumpTableItem;
    }());
    TSCompiler.JumpTableItem = JumpTableItem;
})(TSCompiler || (TSCompiler = {}));
