declare module '@babel/parser/lib/parser' {
  import { ParserOptions } from '@babel/parser';
  import { ClassBody, MemberExpression, Node, Program } from '@babel/types';
  export default class Parser {
    input: string;
    state: {
      value: string;
      pos: number;
    };

    constructor(options: ParserOptions, input: string);

    startNode(): Node;
    finishNode(node: Node, type: string): Node;
    finishToken(type: string, value: string): void;
    next(): void;
    parse(): Program;
    parseStatementLike(...args: any): Node;
    parseMaybeAssign(...args: any): Node;
    getTokenFromCode(code: number): void;
    parseClassMember(
      classBody: ClassBody,
      member: MemberExpression,
      state: any
    ): Node;
  }
}
