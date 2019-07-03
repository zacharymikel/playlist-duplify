import { Request, Response } from 'express';
import { ApiRequest, ApiResponse } from '../utils/request';
import Playlist from '../models/Playlist';

export const getPlaylists = async (req: Request, res: Response) => {
    const authToken = req.headers.authorization;
    const userId = req.query.userId;
    
    const playlistRequest = new ApiRequest()
        .withAuth(authToken)
        .withBaseUri("https://api.spotify.com/v1")
        .withPath(`/users/${userId}/playlists`);

    try {
        const playlistResponse = await playlistRequest.get();
        const playlists = buildPlaylists(playlistResponse.data);

        return res.json(playlists);

    } catch (error) {
        const result = new ApiResponse();
        result.status = error.status;
        result.error = "There was a problem getting your playlists. Please try again.";
        
        res.status = error.status;
        res.json(result);
    }
}

const buildPlaylists = (data: any): Playlist[] => {
    let result: Playlist[] = [];
    for(let item of data.items) {
        const playlist = new Playlist();
        playlist.href = item.href;
        playlist.id = item.id;
        playlist.images = item.images;
        playlist.name = item.name;
        playlist.tracks = item.tracks;
        playlist.userId = item.owner.id;
    }
    return result;
}