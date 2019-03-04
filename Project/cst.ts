module TSCompiler{
    export class csTree{
        private root: Node;
        private currentNode: Node;

        constructor(){
            this.root = null;
            this.currentNode = null;
        }

        public addLeaf(){

        }

        public addBranch(type: string): void{
            var node: Node = new Node();
            node.setType(type);
        }

        public setRoot(node: Node){
            this.root = node;
        }

        public getRoot(): Node{
            return this.root;
        }

        public endChildren(){

        }
    }
}