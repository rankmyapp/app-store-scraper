import { Markets } from "../constants";
import { ITunesLookupApp } from "../interfaces/itunes.lookup.interface";
import { ITunesApp } from "../interfaces/app.interface";
export declare function cleanApp(app: ITunesLookupApp): ITunesApp;
export declare function lookup(ids: string[], idField?: string, country?: string, lang?: string, requestOptions?: {}): Promise<ITunesApp[]>;
export declare function getStoreId(countryCode: string): Markets | "143441";
//# sourceMappingURL=index.d.ts.map