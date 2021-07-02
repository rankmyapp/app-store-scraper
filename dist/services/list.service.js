"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = void 0;
var axios_1 = __importDefault(require("axios"));
var common_1 = require("../common");
var constants_1 = require("../constants");
function parseLink(app) {
    if (app.link) {
        var linkArray = Array.isArray(app.link) ? app.link : [app.link];
        var link = linkArray.find(function (linkEntry) { return linkEntry.attributes.rel === "alternate"; });
        return link && link.attributes.href;
    }
    return undefined;
}
function cleanApp(app) {
    var developerUrl, developerId;
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
    var price = parseFloat(app["im:price"].attributes.amount);
    return {
        id: app.id.attributes["im:id"],
        appId: app.id.attributes["im:bundleId"],
        title: app["im:name"].label,
        icon: app["im:image"][app["im:image"].length - 1].label,
        url: parseLink(app),
        price: price,
        currency: app["im:price"].attributes.currency,
        free: price === 0,
        description: app.summary ? app.summary.label : undefined,
        developer: app["im:artist"].label,
        developerUrl: developerUrl,
        developerId: developerId,
        genre: app.category.attributes.label,
        genreId: app.category.attributes["im:id"],
        released: app["im:releaseDate"].label,
    };
}
function processResults(_a, _b) {
    var entry = _a.feed.entry;
    var country = _b.country, fullDetail = _b.fullDetail, lang = _b.lang, requestOptions = _b.requestOptions;
    if (!entry) {
        return [];
    }
    var apps = Array.isArray(entry) ? entry : [entry];
    if (fullDetail) {
        var ids = apps.map(function (app) { return app.id.attributes["im:id"]; });
        return common_1.lookup(ids, "id", country, lang, requestOptions);
    }
    return apps.map(cleanApp);
}
function validate(_a) {
    var category = _a.category, collection = _a.collection, num = _a.num;
    if (!category || !(category in constants_1.Category)) {
        throw Error("Invalid category " + category);
    }
    if (!collection || !Object.values(constants_1.Collection).includes(collection)) {
        throw Error("Invalid collection " + collection);
    }
    if (!num || num > 200) {
        throw Error("Cannot retrieve more than 200 apps");
    }
}
function list(options) {
    return __awaiter(this, void 0, void 0, function () {
        var category, _a, country, _b, collection, _c, num, requestOptions, genre, categoryParam, storeId, url, data;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    category = options.category, _a = options.country, country = _a === void 0 ? "BR" : _a, _b = options.collection, collection = _b === void 0 ? constants_1.Collection.TOP_FREE_IOS : _b, _c = options.num, num = _c === void 0 ? 50 : _c, requestOptions = options.requestOptions;
                    validate({ category: category, collection: collection, num: num });
                    genre = typeof category === "number" ? category : constants_1.Category[category];
                    categoryParam = category ? "/genre=" + genre : "";
                    storeId = common_1.getStoreId(country);
                    url = "http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/" + collection + categoryParam + "/limit=" + num + "/json?s=" + storeId;
                    return [4 /*yield*/, axios_1.default.get(url, {
                            params: requestOptions,
                        })];
                case 1:
                    data = (_d.sent()).data;
                    return [2 /*return*/, processResults(data, options)];
            }
        });
    });
}
exports.list = list;
//# sourceMappingURL=list.service.js.map