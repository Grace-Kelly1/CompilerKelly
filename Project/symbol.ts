/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="Tree.ts"/>

module TSCompiler {
    export class Symbol {
        private name: string;
        private type: string;
        private line: number;
        private isInitialized: boolean = false;

        constructor(name: string, type: string, line: number) {
            this.setName(name);
            this.setType(type);
            this.setLine(line);
        }

        public getName(): string {
            return this.name;
        }

        public setName(name: string): void {
            this.name = name;
        }

        public getType(): string {
            return this.type;
        }

        public setType(type: string) {
            this.type = type;
        }

        public getLine(): string {
            return this.line.toString();
        }

        public setLine(line: number) {
            this.line = line;
        }

        public getInitialized(): boolean {
            return this.isInitialized;
        }

        public setInitialized(bool: boolean): void {
            this.isInitialized = bool;
        }
    }
}