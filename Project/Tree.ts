//-----------------------------------------
// Based on treeDemo.js
//
// By Alan G. Labouseur, based on the 2009
// work by Michael Ardizzone and Tim Smith.
//-----------------------------------------
/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="parse.ts"/>
/// <reference path="node.ts"/>

module TSCompiler{
    export class Tree{
    // ----------
    // Attributes
    // ----------

    private root: Node;
    private currentNode: Node;

    constructor() {
        this.root = null;
        this.currentNode = null;
    }

    public getRoot(): Node {
        return this.root;
    }

    public setRoot(node: Node) {
        this.root = node;
    }

    public addBranchNode(type: string): void {
        // Create a node to be added
        var node: Node = new Node();
        node.setType(type);

        if (this.root === null || (!this.root)) {
            this.root = node;
            this.currentNode = node;
        } else {
            this.currentNode.addChild(node);
            node.setParent(this.currentNode);
            this.currentNode = node;
        }
    }

    public addLeafNode(token: Token): void {
        var node: Node = new Node();
        node.setType(token.type);
        node.setValue(token.value);
        node.setLeafNode(true);
        node.setLineNumber(token.line);

        if (this.root === null || (!this.root)) {
            // log an error message, throw error

        } else {
            this.currentNode.addChild(node);
            node.setParent(this.currentNode);
        }
    }

    // Add a node: kind in {branch, leaf}.
    // addNode = function(name, kind) {
    //     // Construct the node object.
    //     var node = {
    //         name: name,
    //         children: [],
    //         parent: {},
    //         // row: row,
    //         // col: col,
    //         // scope: scope,
    //         //= type: type
    //     };

    //     // Check to see if it needs to be the root node.
    //     if ((this.root == null) || (!this.root)) {
    //         // We are the root node.
    //         this.root = node;
    //     }
    //     else {
    //         // We are the children.
    //         // Make our parent the CURrent node...
    //         node.parent = this.cur;
    //         // ... and add ourselves (via the unfrotunately-named
    //         // "push" function) to the children array of the current node.
    //         this.cur.children.push(node);
    //     }
    //     // If we are an interior/branch node, then...
    //     if (kind == "branch") {
    //         // ... update the CURrent node pointer to ourselves.
    //         this.cur = node;
    //     }
    // };

    // Note that we're done with this branch of the tree...
    kick = function() {
        // ... by moving "up" to our parent node (if possible).
        if ((this.currentNode.getParent() !== null) && (this.currentNode.getParent().getType() !== undefined))
            {
                this.currentNode = this.currentNode.getParent();
            }
            else
            {
                // TODO: Some sort of error logging.
                // This really should not happen, but it will, of course.
            }
    };

    // Return a string representation of the tree.
    toString = function() {
        var traversalResult = "";

            // Recursive function to handle the expansion of the nodes.
            function expand(node, depth)
            {
                // Space out based on the current depth so
                // this looks at least a little tree-like.
                for (var i = 0; i < depth; i++)
                {
                    traversalResult += "-";
                }

                // If there are no children (i.e., leaf nodes)...
                if (!node.children || node.children.length === 0)
                {
                    // ... note the leaf node.
                    traversalResult += "[ " + node.value + " ]";
                    traversalResult += "\n";
                }
                else
                {
                    // There are children, so note these interior/branch nodes and ...
                    traversalResult += "< " + node.type + " > \n";
                    // .. recursively expand them.
                    for (var i = 0; i < node.children.length; i++)
                    {
                        expand(node.children[i], depth + 1);
                    }
                }
            }
            // Make the initial call to expand from the root.
            expand(this.root, 0);
            // Return the result.
            return traversalResult;
    }

    public toStringAST() {
            var traversalResult = "";

            // Recursive function to handle the expansion of the nodes.
            function expand(node, depth)
            {
                // Space out based on the current depth so
                // this looks at least a little tree-like.
                for (var i = 0; i < depth; i++)
                {
                    traversalResult += "-";
                }

                // If there are no children (i.e., leaf nodes)...
                if (!node.children || node.children.length === 0)
                {
                    // ... note the leaf node.
                    traversalResult += "[ " + node.type + " ]";
                    traversalResult += "\n";
                }
                else
                {
                    // There are children, so note these interior/branch nodes and ...
                    traversalResult += "< " + node.type + " > \n";
                    // .. recursively expand them.
                    for (var i = 0; i < node.children.length; i++)
                    {
                        expand(node.children[i], depth + 1);
                    }
                }
            }
            // Make the initial call to expand from the root.
            expand(this.root, 0);
            // Return the result.
            return traversalResult;
        }
    

}
}