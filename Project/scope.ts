/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="parse.ts"/>
/// <reference path="sa.ts"/>

module TSCompiler {
    export class Scope {
        // name: number;
        private symbols: Symbol[] = [];
        private children: Scope[] = [];
        private parent: Scope = null;

        constructor(public name: number) {
            // this.setName(name);
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
            var scopeCheck = this.findIdentifierInCurrentScope(id);
            if (!scopeCheck) {
                this.symbols.push(symbol);
            } else {
                _Log_.printError("Identifier '" + id + "' already declared in scope." + "---> Semantic Analyzer");
                throw new Error("ID already in scope");
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
                return this.getTypeOfSymbolInScope(id, this.getParent());
            }
        }

        public getTypeOfSymbolInScope(id: string, scope: Scope): string {
            for (var i = 0; i < scope.symbols.length; i++) {
                if (scope.symbols[i].getName() === id) {
                    return scope.symbols[i].getType();
                }
            }

            if (scope.getParent() != null) {
                return this.getTypeOfSymbolInScope(id, scope.getParent());
            }
        }

        public confirmType(id: string, node): boolean {
            // TODO: If something is being assigned to an ID, we need to check
            // TODO: if that ID is stored in the symbol table with the same type

            var type = this.getTypeOfSymbol(id);
            var value = node.type;

            if (node.getIdentifier()) {
                // Lookup up the ID in scope
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
                        //return (value === "false" || value === "true");
                    default:
                        _Log_.printError("Type not found: " + node.getLineNumber() + "---> Semantic Analyzer");
                        throw new Error("Type not found, breaking. This shouldn't happen.");}
            } else {
                _Log_.printError("Type undefined: " +node.getLineNumber()+ "---> Semantic Analyzer");
                throw new Error("Type undefined, breaking. This shouldn't happen.");
            }
        }

        public findIdentifier(id: string): boolean {
            for (var i = 0; i < this.symbols.length; i++) {
                if (this.symbols[i].getName() === id) {
                    this.symbols[i].setInitialized(true);
                    return true;
                }
            }

            if (this.getParent() != null) {
                return this.findIdentifierInScope(id, this.getParent());
            } else {
                return false;
            }
        }

        public findIdentifierInScope(id: string, scope: Scope): boolean {
            for (var i = 0; i < scope.symbols.length; i++) {
                if (scope.symbols[i].getName() === id) {
                    scope.symbols[i].setInitialized(true);
                    return true;
                }
            }

            if (scope.getParent() != null) {
                return this.findIdentifierInScope(id, scope.getParent());
            } else {
                return false;
            }
        }

        public findIdentifierInCurrentScope(id: string): boolean {
            for (var i = 0; i < this.symbols.length; i++) {
                if (this.symbols[i].getName() === id) {
                    return true;
                }
            }
            return false;
        }
    }
}