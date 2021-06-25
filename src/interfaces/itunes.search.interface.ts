export interface ITunesSearchApp {
  type: number;
  id: string;
  entity: string;
}

export interface ITunesSearchResponse {
  metricsBase: {
    pageType: string;
    pageId: string;
    pageDetails: string;
    page: string;
    serverInstance: string;
    storeFrontHeader: string;
    language: string;
    storeFront: string;
  };
  pageType: number;
  storePlatformData: {
    "native-search-lockup-search": {
      results: [Object];
      version: number;
      isAuthenticated: boolean;
      meta: [Object];
    };
  };
  term: string;
  bubbles: {
    results: ITunesSearchApp[];
    name: string;
    totalCount: number;
  }[];
  metrics: {
    config: Record<string, any>;
    fields: {
      searchTerm: string;
    };
  };
}
