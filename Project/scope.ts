/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="Tree.ts"/>
/// <reference path="symbol.ts"/>

module TSCompiler{
    export class Scope{
        private name: number;
        private symbols: Symbol[] = [];
        private children: Scope[] = [];
        private parent: Scope = null;

        constructor(name: number) {
            this.setName(name);
        }

        public getName(): string {
            return this.name.toString();
        }
        
        public getNameAsInt(): number {
            return this.name;
        }

        public setName(name: number): void {
            this.name = name;
        }

        public addSymbol(symbol: Symbol): void {
            var id = symbol.getName();
            var scopeCheck = this.findIdentifierScopeCurrent(id);
            if (!scopeCheck) {
                this.symbols.push(symbol);
            } else {
                _Log_.printSAError("Identifier '" + id + "' already declared in scope.");
            }
        }

        public getSymbols(): Symbol[] {
            return this.symbols;
        }

        public getChildren(): Scope[] {
            return this.children;
        }

        public addChild(child: Scope): void {
            this.children.push(child);
        }

        public getParent(): Scope {
            return this.parent;
        }

        public setParent(parent: Scope): void {
            this.parent = parent;
        }

        public getTypeOfSymbol(id: string): string {
            for (var i = 0; i < this.symbols.length; i++) {
                if (this.symbols[i].getName() === id) {
                    return this.symbols[i].getType();
                }
            }

            if (this.getParent() != null) {
                return this.getTypeOfSymbolScope(id, this.getParent());
            }
        }

        public getTypeOfSymbolScope(id: string, scope: Scope): string {
            for (var i = 0; i < scope.symbols.length; i++) {
                if (scope.symbols[i].getName() === id) {
                    return scope.symbols[i].getType();
                }
            }

            if (scope.getParent() != null) {
                return this.getTypeOfSymbolScope(id, scope.getParent());
            }
        }

        public confirmType(id: string, node): boolean {
            var type = this.getTypeOfSymbol(id);
            var value = node.type;

            if (node.getIdentifier()) {
                var idType = this.getTypeOfSymbol(node.getType());
                return type === idType;

            } else if (type) {
                switch (type) {
                    case "int":
                        return !isNaN(value);
                    case "string":
                        if (value === "true" || value === "false") {
                            return !node.isBoolean;
                        }

                        if (node.isInt) {
                            return false;
                        }

                        return (typeof value === 'string');
                    case "boolean":
                        return node.isBoolean;
                    default:
                        _Log_.printSAError("Type not found.");}
            } else {
                _Log_.printSAError("Type undefined.");
            }
        }

        public findId(id: string): boolean {
            for (var i = 0; i < this.symbols.length; i++) {
                if (this.symbols[i].getName() === id) {
                    this.symbols[i].setInitialized(true);
                    return true;
                }
            }

            if (this.getParent() != null) {
                return this.findIdentifierScope(id, this.getParent());
            } else {
                return false;
            }
        }

        public findIdentifierScope(id: string, scope: Scope): boolean {
            for (var i = 0; i < scope.symbols.length; i++) {
                if (scope.symbols[i].getName() === id) {
                    scope.symbols[i].setInitialized(true);
                    return true;
                }
            }

            if (scope.getParent() != null) {
                return this.findIdentifierScope(id, scope.getParent());
            } else {
                return false;
            }
        }

        public findIdentifierScopeCurrent(id: string): boolean {
            for (var i = 0; i < this.symbols.length; i++) {
                if (this.symbols[i].getName() === id) {
                    return true;
                }
            }
            return false;
        }
    }
}