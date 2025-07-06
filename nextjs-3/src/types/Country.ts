export interface Country {
  name: {
    common: string;
    official: string;
  };
  cca3: string;
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  flags: {
    svg: string;
    png?: string;
    alt?: string;
  };
  languages?: {
    [code: string]: string;
  };
  currencies?: {
    [code: string]: {
      name: string;
      symbol: string;
    };
  };
  borders?: string[];
}
