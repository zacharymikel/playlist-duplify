"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const request_1 = require("../utils/request");
exports.getProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const authToken = req.headers.authorization;
    const spotifyProfileRequest = new request_1.ApiRequest()
        .withAuth(authToken)
        .withBaseUri('https://api.spotify.com/v1/')
        .withPath('me');
    try {
        const response = yield (spotifyProfileRequest.get());
        return res.json(response);
    }
    catch (error) {
        logger_1.default.error(error);
        const response = new request_1.ApiResponse();
        response.error = "There was a problem getting your profile. Please try again.";
        res.status(error.status);
        res.json(response);
    }
});
//# sourceMappingURL=profile.js.map