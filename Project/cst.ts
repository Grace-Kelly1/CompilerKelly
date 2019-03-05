/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="Node.ts"/>

module TSCompiler{
    export class csTree{
        private root: Node;
        private currentNode: Node;

        constructor(){
            this.root = null;
            this.currentNode = null;
        }

        public addLeaf(token: Token): void{
            var node: Node = new Node();
            //Need more
            node.setType(token.type);
            node.setValue(token.value);
            node.setLeaf(true);
            node.setLine(token.line);

            if (this.root === null || (!this.root)) {
                // log an error message, throw error

            } else {
                this.currentNode.addChild(node);
                node.setParent(this.currentNode);
            }
        }

        public addBranch(type: string): void{
            var node: Node = new Node();
            node.setType(type);
            if(this.root === null || (!this.root)){
                this.root = node;
                this.currentNode = node;
            } 
            else{
                this.currentNode.addChild(node);
                node.setParent(this.currentNode);
                this.currentNode = node;
            }
        }

        public setRoot(node: Node){
            this.root = node;
        }

        public getRoot(): Node{
            return this.root;
        }

        public endChildren(): void{
            if ((this.currentNode.getParent() !== null) && (this.currentNode.getParent().getType() !== undefined))
            {
                this.currentNode = this.currentNode.getParent();
            }
        }
    }
}