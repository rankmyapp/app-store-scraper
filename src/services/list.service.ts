"use strict";

import axios from "axios";
import { lookup, getStoreId } from "../common";
import { Category, Collection } from "../constants";
import { CategoryOptions } from "../interfaces/category.options.interface";
import { ITunesCategoryItem } from "../interfaces/category.interface";
import {
  ITunesCategoryResponse,
  ITunesCategoryResponseEntry,
} from "../interfaces/itunes.category.interface";

function parseLink(app: ITunesCategoryResponseEntry) {
  if (app.link) {
    const linkArray = Array.isArray(app.link) ? app.link : [app.link];
    const link = linkArray.find(
      (linkEntry) => linkEntry.attributes.rel === "alternate"
    );

    return link && link.attributes.href;
  }

  return undefined;
}

function cleanApp(app: ITunesCategoryResponseEntry): ITunesCategoryItem {
  let developerUrl, developerId;

  if (app["im:artist"].attributes) {
    developerUrl = app["im:artist"].attributes.href;

    if (app["im:artist"].attributes.href.includes("/id")) {
      // some non developer urls can sneak in here
      // e.g. href: 'https://itunes.apple.com/us/artist/sling-tv-llc/959665097?mt=8&uo=2'
      developerId = app["im:artist"].attributes.href
        .split("/id")[1]
        .split("?mt")[0];
    }
  }

  const price = parseFloat(app["im:price"].attributes.amount);
  return {
    id: app.id.attributes["im:id"],
    appId: app.id.attributes["im:bundleId"],
    title: app["im:name"].label,
    icon: app["im:image"][app["im:image"].length - 1].label,
    url: parseLink(app),
    price,
    currency: app["im:price"].attributes.currency,
    free: price === 0,
    description: app.summary ? app.summary.label : undefined,
    developer: app["im:artist"].label,
    developerUrl,
    developerId,
    genre: app.category.attributes.label,
    genreId: app.category.attributes["im:id"],
    released: app["im:releaseDate"].label,
  };
}

function processResults(
  { feed: { entry } }: ITunesCategoryResponse,
  { country, fullDetail, lang, requestOptions }: CategoryOptions
) {
  if (!entry) {
    return [];
  }

  const apps = Array.isArray(entry) ? entry : [entry];

  if (fullDetail) {
    const ids = apps.map((app) => app.id.attributes["im:id"]);

    return lookup(ids, "id", country, lang, requestOptions);
  }

  return apps.map(cleanApp);
}

function validate({ category, collection, num }: CategoryOptions) {
  if (!category || !(category in Category)) {
    throw Error("Invalid category " + category);
  }

  if (!collection || !Object.values(Collection).includes(collection)) {
    throw Error(`Invalid collection ${collection}`);
  }

  if (!num || num > 200) {
    throw Error("Cannot retrieve more than 200 apps");
  }
}

export async function list(options: CategoryOptions) {
  const {
    category,
    country = "BR",
    collection = Collection.TOP_FREE_IOS,
    num = 50,
    requestOptions,
  } = options;

  validate({ category, collection, num });

  // Return only the category code
  const genre = typeof category === "number" ? category : Category[category];
  const categoryParam = category ? `/genre=${genre}` : "";
  const storeId = getStoreId(country);

  const url = `http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/${collection}${categoryParam}/limit=${num}/json?s=${storeId}`;

  const { data }: { data: ITunesCategoryResponse } = await axios.get(url, {
    params: requestOptions,
  });

  return processResults(data, options);
}
