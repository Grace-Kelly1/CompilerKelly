module TSCompiler {
    export class Node {
        //Props
        private type: string;
        private value: string;
        public children: Node[];
        private parent: Node;
        private lineNumber: number;
        private isLeafNode: boolean;
        private isBoolean: boolean = false;
        private isInt: boolean = false;
        private isIdentifier: boolean = false;

        constructor(type?: string) {
            if (type) {
                this.type = type;
            } else {
                this.type = "";
            }

            this.value = "";
            this.children = [];
            this.parent = null;
            this.lineNumber = 0;
            this.isLeafNode = false;
        }

        public getType(): string {
            return this.type;
        }

        public setType(type: string): void {
            this.type = type;
        }

        public getValue(): string {
            return this.value;
        }

        public setValue(value: string): void {
            this.value = value;
        }

        public getParent(): Node {
            return this.parent;
        }

        public setParent(parent: Node): void {
            this.parent = parent;
        }

        public getLineNumber(): number {
            return this.lineNumber;
        }

        public setLineNumber(number: number): void {
            this.lineNumber = number;
        }

        public checkLeafNode(): boolean {
            return this.isLeafNode;
        }

        public setLeafNode(bool: boolean): void {
            this.isLeafNode = bool;
        }

        public checkBoolean(): boolean {
            return this.isBoolean;
        }

        public setBoolean(bool: boolean): void {
            this.isBoolean = bool;
        }

        public getInt(): boolean {
            return this.isInt;
        }

        public setInt(bool: boolean): void {
            this.isInt = bool;
        }

        public addChild(node: Node): void {
            this.children.push(node);
        }

        public getIdentifier(): boolean {
            return this.isIdentifier;
        }


        public setIdentifier(bool: boolean): void {
            this.isIdentifier = bool;
        }
    }
}