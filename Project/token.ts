/// <reference path="globals.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="utils.ts"/>

module TSCompiler{
    export class Token{

        // Type: string;
        // Value: string;
        // Line: number;

        // public newToken(type, value, line){
        //     var Token = new Token(type, value, line);
        //     return Token;
        // }

        constructor(public type: string, 
		              public value: string, 
						  public line: number) {
            // this.type = type;
            // this.value = value;
            // this.line = line;
        }
    }
}