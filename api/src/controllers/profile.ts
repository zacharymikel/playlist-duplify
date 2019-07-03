"use strict";

import logger from "../utils/logger";
import { Response, Request } from "express";
import { ApiRequest, ApiResponse } from "../utils/request";

export const getProfile = async (req: Request, res: Response) => {
    
    const authToken = req.headers.authorization;

    const spotifyProfileRequest = new ApiRequest()
        .withAuth(authToken)
        .withBaseUri('https', 'api.spotify.com/v1/')
        .withPath('me')

    try {
        const response = await(spotifyProfileRequest.get());
        return res.json(response);
    
    } catch (error) {
        logger.error(error);

        const response = new ApiResponse();
        response.error = "There was a problem getting your profile. Please try again.";

        res.status(error.status);
        res.json(response);
    }
}