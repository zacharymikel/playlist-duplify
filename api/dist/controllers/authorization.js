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
const SpotifyScopes_1 = __importDefault(require("../models/SpotifyScopes"));
const request_1 = require("../utils/request");
const StateService_1 = __importDefault(require("../services/StateService"));
exports.getSignInUrl = (req, res) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI);
    const scopesEncoded = encodeURIComponent(SpotifyScopes_1.default.join(" "));
    const state = StateService_1.default.generateNewState();
    const url = `https://accounts.spotify.com/authorize?` +
        `client_id=${clientId}&` +
        `response_type=code&` +
        `redirect_uri=${redirectUri}&` +
        `state=${state}&` +
        `scope=${scopesEncoded}`;
    res.redirect(url);
};
exports.getAuthToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const state = req.query['state'];
    const authorizationCode = req.query['code'];
    // Make sure that this call is coming from spotify (where we passed state above)
    if (!StateService_1.default.validateState(state)) {
        res.status(200);
        return res.json(new request_1.ApiResponse());
    }
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
    const clientBasicToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const spotifyApiRequest = new request_1.ApiRequest()
        .withAuth(clientBasicToken, 'Basic')
        .withContentType('application/x-www-form-urlencoded')
        .withBaseUri('https://accounts.spotify.com/api/')
        .withPath('token/');
    try {
        const spotifyResponse = yield spotifyApiRequest.post({
            'grant_type': 'authorization_code',
            'code': authorizationCode,
            'redirect_uri': redirectUri
        });
        if (spotifyResponse.data) {
            return res.json(spotifyResponse);
        }
    }
    catch (error) {
        logger_1.default.error(error);
        const response = new request_1.ApiResponse();
        response.error = "There was a problem signing. Please try again.";
        res.status(error.status);
        res.json(response);
    }
});
//# sourceMappingURL=authorization.js.map