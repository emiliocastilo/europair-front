export interface Airport {
  id: number;
  name: string;
}

export const EMPTY_AIRPORT: Airport = {
  id: null,
  name: '',
} as const;
