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
const request_1 = require("../utils/request");
const Playlist_1 = __importDefault(require("../models/Playlist"));
exports.getPlaylists = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const authToken = req.headers.authorization;
    const userId = req.query.userId;
    const playlistRequest = new request_1.ApiRequest()
        .withAuth(authToken)
        .withBaseUri("https://api.spotify.com/v1")
        .withPath(`/users/${userId}/playlists`);
    try {
        const playlistResponse = yield playlistRequest.get();
        const playlists = buildPlaylists(playlistResponse.data);
        return res.json(playlists);
    }
    catch (error) {
        const result = new request_1.ApiResponse();
        result.status = error.status;
        result.error = "There was a problem getting your playlists. Please try again.";
        res.status = error.status;
        res.json(result);
    }
});
const buildPlaylists = (data) => {
    let result = [];
    for (let item of data.items) {
        const playlist = new Playlist_1.default();
        playlist.href = item.href;
        playlist.id = item.id;
        playlist.images = item.images;
        playlist.name = item.name;
        playlist.tracks = item.tracks;
        playlist.userId = item.owner.id;
    }
    return result;
};
//# sourceMappingURL=playlists.js.map