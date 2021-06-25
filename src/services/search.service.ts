import axios from "axios";
import { lookup, storeId } from "../common";
import { ITunesSearchResponse } from "../interfaces/itunes.search.interface";
import { SearchOptions } from "../interfaces/search.options.interface";

const BASE_URL =
  "https://store-scrapers-api.azure-api.net/va/WebObjects/MZStore.woa/wa/search?clientApplication=Software&media=software&term=";

// TODO find out if there's a way to filter by device
// TODO refactor to allow memoization of the first request

function paginate(num = 50, page = 0) {
  const pageStart = num * (page ? page - 1 : 0);
  const pageEnd = pageStart + num;

  return <T>(arr: T[]) => arr.slice(pageStart, pageEnd);
}

export function search({ term, country, lang = 'en-us', requestOptions, num, page, idsOnly }: SearchOptions) {
  return new Promise(function (resolve, reject) {
    if (!term) {
      throw Error("term is required");
    }

    const url = BASE_URL + encodeURIComponent(term);
    const countryStoreId = storeId(country);

    axios.get(
      url,
      {
        headers: {
          "X-Apple-Store-Front": `${countryStoreId},24 t:native`,
          "Accept-Language": lang,
        },
        params: requestOptions
      }
    )
      .then(({ data }) => data)
      .then(
        (response: ITunesSearchResponse) => (response.bubbles[0] && response.bubbles[0].results) || []
      )
      .then(paginate(num, page))
      .then((items) => items.map(({ id }) => id))
      .then((ids) => {
        if (idsOnly) {
          return ids;
        }

        return lookup(
          ids,
          "id",
          country,
          lang,
          requestOptions
        );
      })
      .then(resolve)
      .catch(reject);
  });
}
