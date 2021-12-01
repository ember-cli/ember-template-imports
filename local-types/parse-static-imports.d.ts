declare module 'parse-static-imports' {
  export interface Import {
    moduleName: string;
    starImport: string;
    namedImports: { name: string; alias: string }[];
    defaultImport: string;
    sideEffectOnly: boolean;
  }

  export default function parseStaticImports(code: string): Import[];
}
