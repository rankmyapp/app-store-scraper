/// <reference types="node" />
import { URLSearchParams } from "url";
import { Category, Collection } from "../constants";
import { Country } from "./itunes.lookup.interface";
export interface CategoryOptions {
    category: Category;
    country?: Country;
    collection?: Collection;
    num?: number;
    requestOptions?: URLSearchParams | Record<string, any>;
    fullDetail?: boolean;
    lang?: string;
}
//# sourceMappingURL=category.options.interface.d.ts.map