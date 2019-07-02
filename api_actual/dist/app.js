"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression")); // compresses requests
const body_parser_1 = __importDefault(require("body-parser"));
const lusca_1 = __importDefault(require("lusca"));
// Load .env onto process
require('./utils/secrets');
// Controllers (route handlers)
const apiController = __importStar(require("./controllers/api"));
const authorizationController = __importStar(require("./controllers/authorization"));
// Create Express server
const app = express_1.default();
// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(compression_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(lusca_1.default.xframe("SAMEORIGIN"));
app.use(lusca_1.default.xssProtection(true));
/**
 * API examples routes.
 */
app.get("/api", apiController.getApi);
app.get("/authorize", authorizationController.getSignInUrl);
app.get("/spotify-response", authorizationController.getAuthToken);
exports.default = app;
//# sourceMappingURL=app.js.map