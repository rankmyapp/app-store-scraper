import axios from "axios";
import { markets } from "../constants";
import { ITunesLookupApp } from "../interfaces/itunes.lookup.interface";
import { ITunesApp } from "../interfaces/app.interface";

const LOOKUP_URL = "https://itunes.apple.com/lookup";

export function cleanApp(app: ITunesLookupApp): ITunesApp {
  return {
    id: app.trackId,
    appId: app.bundleId,
    title: app.trackName,
    url: app.trackViewUrl,
    description: app.description,
    icon: app.artworkUrl512 || app.artworkUrl100 || app.artworkUrl60,
    genres: app.genres,
    genreIds: app.genreIds,
    primaryGenre: app.primaryGenreName,
    primaryGenreId: app.primaryGenreId,
    contentRating: app.contentAdvisoryRating,
    languages: app.languageCodesISO2A,
    size: app.fileSizeBytes,
    requiredOsVersion: app.minimumOsVersion,
    released: app.releaseDate,
    updated: app.currentVersionReleaseDate || app.releaseDate,
    releaseNotes: app.releaseNotes,
    version: app.version,
    price: app.price,
    currency: app.currency,
    free: app.price === 0,
    developerId: app.artistId,
    developer: app.artistName,
    developerUrl: app.artistViewUrl,
    developerWebsite: app.sellerUrl,
    score: app.averageUserRating,
    reviews: app.userRatingCount,
    currentVersionScore: app.averageUserRatingForCurrentVersion,
    currentVersionReviews: app.userRatingCountForCurrentVersion,
    screenshots: app.screenshotUrls,
    ipadScreenshots: app.ipadScreenshotUrls,
    appletvScreenshots: app.appletvScreenshotUrls,
    supportedDevices: app.supportedDevices,
  };
}

export async function lookup(
  ids: string[],
  idField = "id",
  country = "us",
  lang?: string,
  requestOptions = {}
) {
  const langParam = lang ? `&lang=${lang}` : "";
  const joinedIds = ids.join(",");
  const url = `${LOOKUP_URL}?${idField}=${joinedIds}&country=${country}&entity=software${langParam}`;
  const { data } = await axios.get(url, { ...requestOptions });

  const filtered = data.results.filter(function (app: { wrapperType: string }) {
    return (
      typeof app.wrapperType === "undefined" || app.wrapperType === "software"
    );
  });

  return filtered.map(cleanApp);
}

export function storeId(countryCode: string) {
  const defaultStore = "143441";
  const key = countryCode.toUpperCase() as keyof typeof markets;

  return (countryCode && markets[key]) || defaultStore;
}
