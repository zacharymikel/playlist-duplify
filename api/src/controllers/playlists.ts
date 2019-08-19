import { Request, Response } from "express";
import { ApiRequest, ApiResponse } from "../utils/request";
import Playlist from "../models/Playlist";
import logger from "../utils/logger";
import Error from '../models/Error';

export const clonePlaylist = async (req: Request, res: Response) => {
  const authToken = req.headers.authorization;
  let userId = req.headers.userid;
  const playlistId = req.body.playlistId;

  const getExistingPlaylistRequest = new ApiRequest()
    .withAuth(authToken)
    .withBaseUri("https://api.spotify.com/v1")
    .withPath(`/users/${userId}/playlists/${playlistId}`);

  try {
    const playlistResponse = await getExistingPlaylistRequest.get();
    if(playlistResponse.status === 200 && playlistResponse.data) {
      const playlistRawResponse = playlistResponse.data;
      const playlistFormattedResponse = new Playlist(playlistRawResponse);
      return res.json(playlistFormattedResponse);
    }
  
  } catch (error) {
    const result = new ApiResponse();
    result.status = error.status;
    result.error =
      "There was a problem getting your playlists. Please try again.";
    res.status = error.status;
    res.json(result);
  }
};

export const getPlaylists = async (req: Request, res: Response) => {
  const errorHandler = (status: any): Error => { 
    return new Error(status, 'There was a problem getting your playlists. Please try again.');
  }
  
  const authToken = req.headers.authorization;
  let userId = req.headers.userid;

  const playlistRequest = new ApiRequest()
    .withAuth(authToken)
    .withBaseUri("https://api.spotify.com/v1")
    .withPath(`/users/${userId}/playlists`);

  try {
    const playlistResponse = await playlistRequest.get();

    if(playlistResponse.status === 200 && playlistResponse.data) {
      const playlists = playlistResponse.data.items; 
      const result = [];
      for(let playlist of playlists) {
        result.push(new Playlist(playlist));
      }
      return res.json(result);
    }

    else {
      return res.json(errorHandler(playlistResponse.status));
    }

  } catch (error) {
    console.log(error);
    const status = error.status || 500;
    return res.json(errorHandler(status));
  }
};