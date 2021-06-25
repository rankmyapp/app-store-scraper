"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
var axios_1 = __importDefault(require("axios"));
var common_1 = require("../common");
var BASE_URL = "https://store-scrapers-api.azure-api.net/va/WebObjects/MZStore.woa/wa/search?clientApplication=Software&media=software&term=";
// TODO find out if there's a way to filter by device
// TODO refactor to allow memoization of the first request
function paginate(num, page) {
    if (num === void 0) { num = 50; }
    if (page === void 0) { page = 0; }
    var pageStart = num * (page ? page - 1 : 0);
    var pageEnd = pageStart + num;
    return function (arr) { return arr.slice(pageStart, pageEnd); };
}
function search(_a) {
    var term = _a.term, country = _a.country, _b = _a.lang, lang = _b === void 0 ? 'en-us' : _b, requestOptions = _a.requestOptions, num = _a.num, page = _a.page, idsOnly = _a.idsOnly;
    return new Promise(function (resolve, reject) {
        if (!term) {
            throw Error("term is required");
        }
        var url = BASE_URL + encodeURIComponent(term);
        var countryStoreId = common_1.storeId(country);
        axios_1.default.get(url, {
            headers: {
                "X-Apple-Store-Front": countryStoreId + ",24 t:native",
                "Accept-Language": lang,
            },
            params: requestOptions
        })
            .then(function (_a) {
            var data = _a.data;
            return data;
        })
            .then(function (response) { return (response.bubbles[0] && response.bubbles[0].results) || []; })
            .then(paginate(num, page))
            .then(function (items) { return items.map(function (_a) {
            var id = _a.id;
            return id;
        }); })
            .then(function (ids) {
            if (idsOnly) {
                return ids;
            }
            return common_1.lookup(ids, "id", country, lang, requestOptions);
        })
            .then(resolve)
            .catch(reject);
    });
}
exports.search = search;
//# sourceMappingURL=search.service.js.map