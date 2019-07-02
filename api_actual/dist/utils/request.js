"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
class ApiResponse {
}
exports.ApiResponse = ApiResponse;
class ApiRequest {
    constructor() { }
    withAuth(type, token) {
        this.auth = type + " " + token;
        return this;
    }
    withBaseUri(http, uri) {
        this.baseUri = `${http}://${uri}`;
        return this;
    }
    withPath(path) {
        this.path = path;
        return this;
    }
    withContentType(type) {
        this.contentType = type;
        return this;
    }
    post(data) {
        const options = this.getOptions(data);
        return new Promise((resolve, reject) => {
            request_1.default.post(options, (error, response, body) => {
                const result = new ApiResponse();
                if (response.statusCode === 200) {
                    result.data = JSON.parse(body);
                    return resolve(result);
                }
                result.error = error;
                return reject(result);
            });
        });
    }
    getOptions(data) {
        let options = {
            url: `${this.baseUri}${this.path}`
        };
        if (this.contentType || this.auth) {
            options.headers = {};
            options.headers['Content-Type'] = this.contentType;
            options.headers['Authorization'] = this.auth;
        }
        if (data) {
            options.data = data;
        }
        return options;
    }
}
exports.ApiRequest = ApiRequest;
//# sourceMappingURL=request.js.map