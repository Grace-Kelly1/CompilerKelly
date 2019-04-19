/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="parse.ts"/>
/// <reference path="sa.ts"/>
var TSCompiler;
(function (TSCompiler) {
    var Scope = /** @class */ (function () {
        function Scope(name) {
            this.symbols = [];
            this.children = [];
            this.parent = null;
            this.setName(name);
        }
        Scope.prototype.getName = function () {
            return this.name.toString();
        };
        Scope.prototype.getNameAsInt = function () {
            return this.name;
        };
        Scope.prototype.setName = function (name) {
            this.name = name;
        };
        Scope.prototype.addSymbol = function (symbol) {
            var id = symbol.getName();
            var scopeCheck = this.findIdentifierInCurrentScope(id);
            if (!scopeCheck) {
                this.symbols.push(symbol);
            }
            else {
                _Log_.printError("Identifier '" + id + "' already declared in scope." + "---> Semantic Analyzer");
                throw new Error("ID already in scope");
            }
        };
        Scope.prototype.getSymbols = function () {
            return this.symbols;
        };
        Scope.prototype.getChildren = function () {
            return this.children;
        };
        Scope.prototype.addChild = function (child) {
            this.children.push(child);
        };
        Scope.prototype.getParent = function () {
            return this.parent;
        };
        Scope.prototype.setParent = function (parent) {
            this.parent = parent;
        };
        Scope.prototype.getTypeOfSymbol = function (id) {
            for (var i = 0; i < this.symbols.length; i++) {
                if (this.symbols[i].getName() === id) {
                    return this.symbols[i].getType();
                }
            }
            if (this.getParent() != null) {
                return this.getTypeOfSymbolInScope(id, this.getParent());
            }
        };
        Scope.prototype.getTypeOfSymbolInScope = function (id, scope) {
            for (var i = 0; i < scope.symbols.length; i++) {
                if (scope.symbols[i].getName() === id) {
                    return scope.symbols[i].getType();
                }
            }
            if (scope.getParent() != null) {
                return this.getTypeOfSymbolInScope(id, scope.getParent());
            }
        };
        Scope.prototype.confirmType = function (id, node) {
            // TODO: If something is being assigned to an ID, we need to check
            // TODO: if that ID is stored in the symbol table with the same type
            var type = this.getTypeOfSymbol(id);
            var value = node.type;
            if (node.getIdentifier()) {
                // Lookup up the ID in scope
                var idType = this.getTypeOfSymbol(node.getType());
                return type === idType;
            }
            else if (type) {
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
                        throw new Error("Type not found, breaking. This shouldn't happen.");
                }
            }
            else {
                _Log_.printError("Type undefined: " + node.getLineNumber() + "---> Semantic Analyzer");
                throw new Error("Type undefined, breaking. This shouldn't happen.");
            }
        };
        Scope.prototype.findIdentifier = function (id) {
            for (var i = 0; i < this.symbols.length; i++) {
                if (this.symbols[i].getName() === id) {
                    this.symbols[i].setInitialized(true);
                    return true;
                }
            }
            if (this.getParent() != null) {
                return this.findIdentifierInScope(id, this.getParent());
            }
            else {
                return false;
            }
        };
        Scope.prototype.findIdentifierInScope = function (id, scope) {
            for (var i = 0; i < scope.symbols.length; i++) {
                if (scope.symbols[i].getName() === id) {
                    scope.symbols[i].setInitialized(true);
                    return true;
                }
            }
            if (scope.getParent() != null) {
                return this.findIdentifierInScope(id, scope.getParent());
            }
            else {
                return false;
            }
        };
        Scope.prototype.findIdentifierInCurrentScope = function (id) {
            for (var i = 0; i < this.symbols.length; i++) {
                if (this.symbols[i].getName() === id) {
                    return true;
                }
            }
            return false;
        };
        return Scope;
    }());
    TSCompiler.Scope = Scope;
})(TSCompiler || (TSCompiler = {}));
