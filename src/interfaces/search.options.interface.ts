import { Country } from "./itunes.lookup.interface";

export interface SearchOptions {
  term: string;
  country: Country;
  lang?: string;
  num?: number;
  page?: number;
  idsOnly?: boolean;
  requestOptions?: Record<string, any>
}