/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="cst.ts"/>
var TSCompiler;
(function (TSCompiler) {
    var Node = /** @class */ (function () {
        function Node(type) {
            this.isBoolean = false;
            this.isInt = false;
            this.isId = false;
            if (type) {
                this.type = type;
            }
            else {
                this.type = "";
            }
            this.value = "";
            this.children = [];
            this.parent = null;
            this.lineNumber = 0;
            this.isLeaf = false;
        }
        Node.prototype.getType = function () {
            return this.type;
        };
        Node.prototype.setType = function (type) {
            this.type = type;
        };
        Node.prototype.getValue = function () {
            return this.value;
        };
        Node.prototype.setValue = function (value) {
            this.value = value;
        };
        Node.prototype.getParent = function () {
            return this.parent;
        };
        Node.prototype.setParent = function (parent) {
            this.parent = parent;
        };
        Node.prototype.getLine = function () {
            return this.lineNumber;
        };
        Node.prototype.setLine = function (number) {
            this.lineNumber = number;
        };
        Node.prototype.checkLeaf = function () {
            return this.isLeaf;
        };
        Node.prototype.setLeaf = function (bool) {
            this.isLeaf = bool;
        };
        Node.prototype.checkBoolean = function () {
            return this.isBoolean;
        };
        Node.prototype.setBoolean = function (bool) {
            this.isBoolean = bool;
        };
        Node.prototype.getInt = function () {
            return this.isInt;
        };
        Node.prototype.setInt = function (bool) {
            this.isInt = bool;
        };
        Node.prototype.addChild = function (node) {
            this.children.push(node);
        };
        Node.prototype.getId = function () {
            return this.isId;
        };
        Node.prototype.setId = function (bool) {
            this.isId = bool;
        };
        return Node;
    }());
    TSCompiler.Node = Node;
})(TSCompiler || (TSCompiler = {}));
