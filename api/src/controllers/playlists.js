import { ApiRequest, ApiResponse } from "../utils/request";
import { sanitizePlaylistName } from "../utils/validation";
import Playlist from "../models/Playlist";
import logger from "../utils/logger";
import Error from '../models/Error';

export const clonePlaylist = async (req, res) => {
  
  const authToken = req.headers.authorization;
  const userId = req.headers.user_id;
  const existingPlaylistId = req.body.existingPlaylistId;
  const newPlaylistName = req.body.newPlaylistName;

  const validName = sanitizePlaylistName(newPlaylistName);
  if(!validName) {
    const result = new ApiResponse();
    result.status = 400;
    result.error =
      "Your playlist name must be alphanumeric!";
    res.json(result);
  }

  const playlistRequest = new ApiRequest(true)
    .withAuth(authToken, "Basic")
    .withBaseUri("https://api.spotify.com/v1");

  
  try {
    const playlistResponse = await playlistRequest.get({ 
      path: `/users/${userId}/playlists/${existingPlaylistId}` 
    });
    
    const playlistRawResponse = playlistResponse.data;
    const existingPlaylist = new Playlist(playlistRawResponse);
    
    const duplicatePlaylist = {
      name: newPlaylistName,
      public: !!existingPlaylist.public,
      collaborative: !!existingPlaylist.collaborative,
      description: existingPlaylist.description
    }

    const createDuplicatePlaylist = await playlistRequest.post({
      path: `/users/${userId}/playlists`,
      formData: duplicatePlaylist,
      contentType: 'application/json'
    });

    res.json(createDuplicatePlaylist);

  } catch (error) {
    const result = new ApiResponse();
    result.status = error.status;
    result.error =
      "There was a problem getting your playlists. Please try again.";
    res.status = error.status;
    res.json(result);
  }
};

export const getPlaylists = async (req, res) => {
  const errorHandler = (status) => { 
    return new Error(status, 'There was a problem getting your playlists. Please try again.');
  }
  
  const authToken = req.headers.authorization;
  let userId = req.headers.user_id;

  const playlistRequest = new ApiRequest(true)
    .withAuth(authToken, "Basic")
    .withBaseUri("https://api.spotify.com/v1");

  try {
    const playlistResponse = await playlistRequest.get({ 
      path: `/users/${userId}/playlists?limit=50`
    });

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