/// <reference path="globals.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="utils.ts"/>

module TSCompiler{
    export class Token{

        public newToken(type, value, lineNumber){
            var token = new token(type, value, lineNumber);
            return token;
        }

        constructor(public type: string, 
		              public value: string, 
						  public line: number) {
            this.type = type;
            this.value = value;
            this.line = line;
        }
    }
}