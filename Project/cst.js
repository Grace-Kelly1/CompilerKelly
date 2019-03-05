/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="Node.ts"/>
var TSCompiler;
(function (TSCompiler) {
    var csTree = /** @class */ (function () {
        function csTree() {
            this.root = null;
            this.currentNode = null;
        }
        csTree.prototype.setRoot = function (node) {
            this.root = node;
        };
        csTree.prototype.getRoot = function () {
            return this.root;
        };
        csTree.prototype.toString = function () {
            var result = "";
            function expand(node, depth) {
                for (var i = 0; i < depth; i++) {
                    result += "-";
                }
                //no children 
                if (!node.children || node.children.length === 0) {
                    result += "[ " + node.value + " ] \n";
                }
                else {
                    result += "< " + node.type + " > \n";
                    for (var i = 0; i < node.children.length; i++) {
                        expand(node.children[i], depth + 1);
                    }
                }
            }
            expand(this.root, 0);
            // end result.
            return result;
        };
        csTree.prototype.addLeaf = function (token) {
            var node = new TSCompiler.Node();
            //Need more
            node.setType(token.type);
            node.setValue(token.value);
            node.setLeaf(true);
            node.setLine(token.line);
            if (this.root === null || (!this.root)) {
                // error message
            }
            else {
                this.currentNode.addChild(node);
                node.setParent(this.currentNode);
            }
        };
        csTree.prototype.addBranch = function (type) {
            var node = new TSCompiler.Node();
            node.setType(type);
            if (this.root === null || (!this.root)) {
                this.root = node;
                this.currentNode = node;
            }
            else {
                this.currentNode.addChild(node);
                node.setParent(this.currentNode);
                this.currentNode = node;
            }
        };
        csTree.prototype.endChildren = function () {
            if ((this.currentNode.getParent() !== null) && (this.currentNode.getParent().getType() !== undefined)) {
                this.currentNode = this.currentNode.getParent();
            }
        };
        return csTree;
    }());
    TSCompiler.csTree = csTree;
})(TSCompiler || (TSCompiler = {}));
