/// <reference path="globals.ts"/>
/// <reference path="logger.ts"/>
/// <reference path="token.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="Tree.ts"/>

module TSCompiler {
    export class Symbol {
        constructor(key, type, line, col, scope, scopeLevel, initialized, utilized) {
            // this.key = key;
            // this.type = type;
            // this.line = line;
            // this.col = col;
            // this.scope = scope;
            // this.scopeLevel = scopeLevel;
            // this.initialized = initialized;
            // this.utilized = utilized;
        }
    
        getKey() {
            return this.key;
        }
    
        getType() {
            return this.type;
        }
    
        getLine() {
            return this.line;
        }
    
        getCol() {
            return this.col;
        }
    
        getDetails() {
            var details = {
                type: this.type,
                line: this.line,
                initialized: this.initialized,
                utilized: this.utilized
            };
            return details;
        }
    }
}