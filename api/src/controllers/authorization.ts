"use strict";

import logger from "../utils/logger";
import { Response, Request } from "express";
import { ApiRequest, ApiResponse } from "../utils/request";
import StateService from '../services/StateService';

export default class AuthorizationController {
    
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes: string;


    constructor(clientId: string, clientSecret: string, redirectUri: string, scopes: string[]) {
        this.clientId = clientId;
        this.redirectUri = encodeURIComponent(redirectUri);
        this.scopes = encodeURIComponent(scopes.join(" "));
    }

    getSignInUrl = () => {
    
        const state = StateService.generateNewState();

        const url = `https://accounts.spotify.com/authorize?` + 
            `client_id=${this.clientId}&` +
            `response_type=code&` + 
            `redirect_uri=${this.redirectUri}&` + 
            `state=${state}&` + 
            `scope=${this.scopes}`;
    
        return url;
    }

    getAuthToken = async (req: Request, res: Response) => {
    
        const state = req.query['state'];
        const authorizationCode = req.query['code'];
    
        // Make sure that this call is coming from spotify (where we passed state above)
        // If it's not valid, return a 200 with no response body. 
        if(!StateService.validateState(state)) {
            res.status(200);    
            return res.json(new ApiResponse());
        }
    
        const clientBasicToken = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
        const spotifyApiRequest = new ApiRequest()
            .withAuth(clientBasicToken, 'Basic')
            .withContentType('application/x-www-form-urlencoded')
            .withBaseUri('https://accounts.spotify.com/api/')
            .withPath('token/');
    
        try {
            const spotifyResponse = await spotifyApiRequest.post({
                'grant_type': 'authorization_code',
                'code': authorizationCode,
                'redirect_uri': this.redirectUri
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
}