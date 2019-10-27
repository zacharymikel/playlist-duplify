"use strict";

import logger from "../utils/logger";
import { ApiRequest, ApiResponse } from "../utils/request";
import StateService from "../services/StateService";

export default class AuthorizationController {
  clientId;
  clientSecret;
  redirectUri;
  scopes;

  constructor(
    clientId,
    clientSecret,
    redirectUri,
    scopes,
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.scopes = encodeURIComponent(scopes.join(" "));
  }

  getSignInUrl = (req, res) => {
    const state = StateService.generateNewState();
    const encodedRedirectUri = encodeURIComponent(this.redirectUri);

    const url =
      `https://accounts.spotify.com/authorize?` +
      `client_id=${this.clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodedRedirectUri}&` +
      `state=${state}&` +
      `scope=${this.scopes}`;

    return res.redirect(url);
  };

  getAuthToken = async (req, res) => {
    const state = req.query["state"];
    const authorizationCode = req.query["code"];

    // Make sure that this call is coming from spotify (where we passed state above)
    // If it's not valid, return a 200 with no response body.
    if (!StateService.validateState(state)) {
      res.status(200);
      return res.json(new ApiResponse());
    }

    const clientBasicToken = Buffer.from(
      `${this.clientId}:${this.clientSecret}`
    ).toString("base64");

    const spotifyApiRequest = new ApiRequest()
      .withAuth(clientBasicToken, "Basic")
      .withContentType("application/x-www-form-urlencoded")
      .withBaseUri('https://accounts.spotify.com/api');

    try {
      const spotifyResponse = await spotifyApiRequest.post({
        path: '/token',
        formData: {
          grant_type: 'authorization_code',
          code: authorizationCode,
          redirect_uri: this.redirectUri
        }
      });

      if (spotifyResponse.data && spotifyResponse.ok()) {
        return res.json(spotifyResponse);
      }
    } catch (error) {
      logger.error(error);

      const response = new ApiResponse();
      response.error = "There was a problem signing. Please try again.";

      res.status(error.status);
      res.json(response);
    }
  };
}
