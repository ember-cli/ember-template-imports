interface TemplateFactory {}
export function hbs(template: string): TemplateFactory;
export function hbs(tagged: TemplateStringsArray): TemplateFactory;
