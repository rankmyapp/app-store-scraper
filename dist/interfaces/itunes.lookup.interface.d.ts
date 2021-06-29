import { Markets } from "../constants";
export declare type Country = keyof typeof Markets;
export interface ITunesLookupApp {
    ipadScreenshotUrls: string[];
    appletvScreenshotUrls: string[];
    artworkUrl60: string;
    artworkUrl512: string;
    artworkUrl100: string;
    artistViewUrl: string;
    screenshotUrls: string[];
    supportedDevices: string[];
    advisories: string[];
    isGameCenterEnabled: boolean;
    kind: string;
    features: string[];
    minimumOsVersion: string;
    trackCensoredName: string;
    languageCodesISO2A: Country[];
    fileSizeBytes: string;
    sellerUrl: string;
    formattedPrice: string;
    contentAdvisoryRating: string;
    averageUserRatingForCurrentVersion: number;
    userRatingCountForCurrentVersion: number;
    averageUserRating: number;
    trackViewUrl: string;
    trackContentRating: string;
    genreIds: string[];
    releaseDate: string;
    trackId: number;
    trackName: string;
    primaryGenreId: number;
    sellerName: string;
    primaryGenreName: string;
    isVppDeviceBasedLicensingEnabled: true;
    currentVersionReleaseDate: string;
    releaseNotes: string;
    currency: string;
    version: string;
    wrapperType: string;
    artistId: number;
    artistName: string;
    genres: string[];
    price: number;
    description: string;
    bundleId: string;
    userRatingCount: number;
}
export interface ITunesLookupResponse {
    resultCount: number;
    results: ITunesLookupApp[];
}
//# sourceMappingURL=itunes.lookup.interface.d.ts.map