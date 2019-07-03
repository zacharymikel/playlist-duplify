"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiController = __importStar(require("./api"));
const authorizationController = __importStar(require("./authorization"));
const profileController = __importStar(require("./profile"));
function default_1(app) {
    app.get("/api", apiController.getApi);
    app.get("/authorize", authorizationController.getSignInUrl);
    app.get("/spotify-response", authorizationController.getAuthToken);
    app.get("/spotify-profile", profileController.getProfile);
}
exports.default = default_1;
//# sourceMappingURL=controllers.js.map