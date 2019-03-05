/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="cst.ts"/>

module TSCompiler{
    export class Node{
        private isLeaf: boolean;
        private isBoolean: boolean = false;
        private isInt: boolean = false;
        private isId: boolean = false;
        private type: string;
        private value: string;
        public children: Node[];
        private parent: Node;
        private lineNumber: number;

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
            this.isLeaf = false;
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

        public getLine(): number {
            return this.lineNumber;
        }

        public setLine(number: number): void {
            this.lineNumber = number;
        }

        public checkLeaf(): boolean {
            return this.isLeaf;
        }

        public setLeaf(bool: boolean): void {
            this.isLeaf = bool;
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

        public getId(): boolean {
            return this.isId;
        }


        public setId(bool: boolean): void {
            this.isId = bool;
        }
    }
}