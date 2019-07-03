"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const logger_1 = __importDefault(require("../utils/logger"));
class ApiResponse {
}
exports.ApiResponse = ApiResponse;
class ApiRequest {
    constructor() { }
    withAuth(token, type) {
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
    get() {
        const options = this.getOptions(null);
        return new Promise((resolve, reject) => {
            request_1.default.get(options, (error, response, body) => {
                const result = this.constructResponse(response);
                this.logResult(result);
                result.status === 200 ? resolve(result) : reject(result);
            });
        });
    }
    post(data) {
        const options = this.getOptions(data);
        return new Promise((resolve, reject) => {
            request_1.default.post(options, (error, response, body) => {
                const result = this.constructResponse(response);
                this.logResult(result);
                result.status === 200 ? resolve(result) : reject(result);
            });
        });
    }
    logResult(result) {
        logger_1.default.debug(`API Request for ${this.buildPath()} completed with status ${result.status}`);
        if (result.status !== 200) {
            logger_1.default.debug(`${JSON.stringify(result.data)}`);
            logger_1.default.debug(`${JSON.stringify(result.error)}`);
        }
    }
    constructResponse(response, error) {
        const result = new ApiResponse();
        const responseBody = this.parseResponse(response);
        result.status = response.statusCode;
        if (response.statusCode === 200) {
            result.data = JSON.parse(response.body);
        }
        else {
            result.error = error || responseBody;
        }
        return result;
    }
    buildPath() {
        return `${this.baseUri}${this.path}`;
    }
    parseResponse(response) {
        return response.body ? JSON.parse(response.body) : {};
    }
    getOptions(data) {
        let options = {
            url: `${this.baseUri}${this.path}`,
            form: data,
        };
        if (this.contentType || this.auth) {
            options.headers = {};
            options.headers['Content-Type'] = this.contentType;
            options.headers['Authorization'] = this.auth;
        }
        return options;
    }
}
exports.ApiRequest = ApiRequest;
//# sourceMappingURL=request.js.map