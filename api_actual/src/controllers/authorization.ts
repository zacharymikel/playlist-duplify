"use strict";

import { Response, Request } from "express";
import scopes from '../models/SpotifyScopes';
import { ApiRequest } from "../utils/request";


export const getSignInUrl = (req: Request, res: Response) => {

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI);
    const scopesEncoded = encodeURIComponent(scopes.join(" ")); 
    
    const url = `https://accounts.spotify.com/authorize?` + 
        `client_id=${clientId}&` +
        `response_type=code&` + 
        `redirect_uri=${redirectUri}&` + 
        `state=asdfjklo&` + 
        `scope=${scopesEncoded}`;

    res.json(url);
}

export const getAuthToken = async (req: Request, res: Response) => {
    const authorizationCode = req.query['code'];

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
    const clientBasicToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const spotifyApiRequest = new ApiRequest()
        .withAuth('Basic', clientBasicToken)
        .withContentType('x-www-form-urlencoded')
        .withBaseUri('https', 'accounts.spotify.com/api/')
        .withPath('token/');

    const spotifyResponse = await spotifyApiRequest.post({
        'grant_type': 'authorization_code',
        'code': authorizationCode,
        'redirect_uri': redirectUri
    });

    if(spotifyResponse.data) {
        return res.json(spotifyResponse);
    }
}