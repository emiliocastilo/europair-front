export interface SearchFilter extends GenericFilter {}

export type GenericFilter = { [header: string]: string | string[] };
