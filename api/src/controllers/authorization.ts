"use strict";

import logger from "../utils/logger";
import { Response, Request } from "express";
import scopes from '../models/SpotifyScopes';
import { ApiRequest, ApiResponse } from "../utils/request";
import StateService from '../services/StateService';

export const getSignInUrl = (req: Request, res: Response) => {

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI);
    const scopesEncoded = encodeURIComponent(scopes.join(" ")); 
    const state = StateService.generateNewState();

    const url = `https://accounts.spotify.com/authorize?` + 
        `client_id=${clientId}&` +
        `response_type=code&` + 
        `redirect_uri=${redirectUri}&` + 
        `state=${state}&` + 
        `scope=${scopesEncoded}`;

    res.redirect(url);
}

export const getAuthToken = async (req: Request, res: Response) => {
    
    const state = req.query['state'];
    const authorizationCode = req.query['code'];

    // Make sure that this call is coming from spotify (where we passed state above)
    if(!StateService.validateState(state)) {
        res.status(200);    
        return res.json(new ApiResponse());
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
    const clientBasicToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const spotifyApiRequest = new ApiRequest()
        .withAuth(clientBasicToken, 'Basic')
        .withContentType('application/x-www-form-urlencoded')
        .withBaseUri('https://accounts.spotify.com/api/')
        .withPath('token/');

    try {
        const spotifyResponse = await spotifyApiRequest.post({
            'grant_type': 'authorization_code',
            'code': authorizationCode,
            'redirect_uri': redirectUri
        });

        if(spotifyResponse.data) {
            return res.json(spotifyResponse);
        }

    } catch (error) {
        logger.error(error);

        const response = new ApiResponse();
        response.error = "There was a problem signing. Please try again.";

        res.status(error.status);
        res.json(response);
    }
}