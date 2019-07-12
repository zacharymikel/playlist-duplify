import request from "supertest";
import AuthorizationController from '../src/controllers/authorization';
import stateService from "../src/services/StateService";
import { ApiRequest } from "../src/utils/request";

import { Response, Request } from "express";
import { mock, instance } from 'ts-mockito';
import { doesNotReject } from "assert";

const clientId = "clientId";
const clientSecret = "secret";
const redirectUri = "redirectUri";
const scopes = [ "can-do-a-thing", "can-do-another-thing" ];
const state = "state";

const ctrl = new AuthorizationController(
    clientId,
    clientSecret,
    redirectUri,
    scopes
);

describe("Authorization ctrl - constructor", () => {
    it('should bootstrap', (done) => {
        expect(ctrl.clientId === clientId);
        expect(ctrl.clientSecret === clientSecret);
        expect(ctrl.redirectUri === encodeURIComponent(redirectUri));
        expect(ctrl.clientSecret === encodeURIComponent(scopes.join(" ")));
        done();
    });
});

describe("Authorization ctrl - getSignInUrl", () => {

    stateService.generateNewState = () => {
        return state; 
    }

    it('should generate the sign-in url', (done) => {
        const url = ctrl.getSignInUrl();
        expect(url).toEqual(
            `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&state=${state}&scope=${encodeURIComponent(scopes.join(" "))}`
        );
        done();
    })
});

describe("Authorization ctrl - getAuthToken", async () => {
    let didPost = false; 
    
    const token = "token";
    const spotifyResponse = {
        data: {
            token: token
        }
    };
    
    ApiRequest.prototype.post = async () => {
        return new Promise<any>((resolve, reject) => {
            didPost = true;
            resolve(spotifyResponse);
        });
    };

    stateService.validateState = () => {
        return true;
    }

    const state = "state";
    const code = "code";

    const req = {
        query: {
            state: state,
            code: code,
        }
    };

    const res = {
        json: (obj: any) => { return obj; },
    };

    it('should get the auth token from spotify', async (done) => {
        const response: any = await ctrl.getAuthToken(req as Request, res as Response);
        expect(didPost).toBeTruthy();
        expect(response.data).toEqual(spotifyResponse.data);
        done();
    });
});

