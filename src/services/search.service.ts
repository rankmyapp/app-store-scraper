import axios from "axios";
import { lookup, storeId } from "../common";
import { ITunesSearchResponse } from "../interfaces/itunes.search.interface";
import { SearchOptions } from "../interfaces/search.options.interface";

const BASE_URL =
  "https://store-scrapers-api.azure-api.net/va/WebObjects/MZStore.woa/wa/search?clientApplication=Software&media=software&term=";

// TODO find out if there's a way to filter by device
// TODO refactor to allow memoization of the first request

function paginate<T>(arr: T[], pageSize = 50, page = 0) {
  const pageStart = pageSize * (page ? page - 1 : 0);
  const pageEnd = pageStart + pageSize;

  return arr.slice(pageStart, pageEnd);
}

export async function search({
  term,
  country,
  lang = "en-us",
  requestOptions,
  num,
  page,
  idsOnly,
}: SearchOptions) {
  if (!term) {
    throw Error("term is required");
  }

  const url = BASE_URL + encodeURIComponent(term);
  const countryStoreId = storeId(country);

  const { data }: { data: ITunesSearchResponse } = await axios.get(url, {
    headers: {
      "X-Apple-Store-Front": `${countryStoreId},24 t:native`,
      "Accept-Language": lang,
    },
    params: requestOptions,
  });

  const results = data.bubbles[0]?.results || [];
  const paginated = paginate(results, num, page);
  const ids = paginated.map(({ id }) => id);

  if (idsOnly) {
    return ids;
  }

  return lookup(ids, "id", country, lang, requestOptions);
}
