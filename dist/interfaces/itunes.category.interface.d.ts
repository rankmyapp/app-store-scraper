interface Labeled {
    label: string;
}
interface Image extends Labeled {
    attributes: {
        height: number;
    };
}
interface Price extends Labeled {
    attributes: {
        amount: string;
        currency: string;
    };
}
interface ContentType {
    attributes: {
        term: string;
        label: string;
    };
}
interface EntryLinkAlternate {
    attributes: {
        rel: string;
        type: string;
        href: string;
    };
}
interface EntryLink {
    "im:duration": Labeled;
    attributes: {
        title: string;
        rel: string;
        type: string;
        href: string;
        "im:assetType": string;
    };
}
interface LinkAlternate {
    attributes: {
        rel: string;
        type: string;
        href: string;
    };
}
interface Link {
    attributes: {
        rel: string;
        href: string;
    };
}
interface ID extends Labeled {
    attributes: {
        "im:id": string;
        "im:bundleId": string;
    };
}
interface Artist extends Labeled {
    attributes: {
        href: string;
    };
}
interface Category {
    attributes: {
        "im:id": string;
        term: string;
        scheme: string;
        label: string;
    };
}
interface ReleaseDate extends Labeled {
    attributes: Labeled;
}
export interface ITunesCategoryResponseEntry {
    "im:name": Labeled;
    "im:image": Image[];
    summary: Labeled;
    "im:price": Price;
    "im:contentType": ContentType;
    rights: Labeled;
    title: Labeled;
    link: [EntryLinkAlternate, EntryLink];
    id: ID;
    "im:artist": Artist;
    category: Category;
    "im:releaseDate": ReleaseDate;
}
export interface ITunesCategoryResponse {
    feed: {
        author: {
            name: Labeled;
            uri: Labeled;
        };
        entry: ITunesCategoryResponseEntry[];
        updated: Labeled;
        rights: Labeled;
        title: Labeled;
        icon: Labeled;
        link: [LinkAlternate, Link];
        id: Labeled;
    };
}
export interface ITunesCategoryInternalEntry {
    id: string;
    appId: string;
    title: string;
    icon: string;
    url: any;
    price: number;
    currency: string;
    free: boolean;
    description?: string;
    developer: string;
    developerUrl?: string;
    developerId?: string;
    genre: string;
    genreId: string;
    released: string;
}
export {};
//# sourceMappingURL=itunes.category.interface.d.ts.map