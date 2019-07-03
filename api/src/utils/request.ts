import request from 'request';
import logger from '../utils/logger';

export class ApiResponse {
    data: any;
    error: any;
    status: number;
}

export class ApiRequest {

    baseUri: String;
    path: String;
    auth: String;
    contentType: String;

    constructor() {}

    withAuth(token: String, type?: String, ): ApiRequest {
        this.auth = type + " " + token;
        return this;
    }

    withBaseUri(http: String, uri: String): ApiRequest {
        this.baseUri = `${http}://${uri}`;
        return this;
    }

    withPath(path: String): ApiRequest {
        this.path = path;
        return this;
    }

    withContentType(type: String): ApiRequest {
        this.contentType = type;
        return this;
    }



    get(): Promise<ApiResponse> {      
        const options = this.getOptions(null);

        return new Promise<ApiResponse>((resolve, reject) => {
            request.get(options, (error: any, response: request.Response, body: any) => {
                const result = this.constructResponse(response);
                this.logResult(result);

                result.status === 200 ? resolve(result) : reject(result);
            });
        });
    }

    post(data: any): Promise<ApiResponse> {    
        const options: any = this.getOptions(data);
        
        return new Promise<ApiResponse>((resolve, reject) => {
            request.post(options, (error: any, response: request.Response, body: any) => {
                const result = this.constructResponse(response);
                this.logResult(result);

                result.status === 200 ? resolve(result) : reject(result);
            });
        });
    }

    logResult(result: ApiResponse) {
        logger.debug(`API Request for ${this.buildPath()} completed with status ${result.status}`);
        if(result.status !== 200) {
            logger.debug(`${JSON.stringify(result.data)}`);
            logger.debug(`${JSON.stringify(result.error)}`);
        }
    }

    constructResponse(response: request.Response, error?: any): ApiResponse {
        const result = new ApiResponse();
        const responseBody = this.parseResponse(response);
        result.status = response.statusCode;
        
        if (response.statusCode === 200) {
            result.data = JSON.parse(response.body);
        } else {
            result.error = error || responseBody;
        }
        return result;
    }

    buildPath(): String {
        return `${this.baseUri}${this.path}`;
    }

    parseResponse(response: request.Response): any {
        return response.body ? JSON.parse(response.body) : {};
    }

    getOptions(data: any): any {
        let options: any = {
            url: `${this.baseUri}${this.path}`,
            form: data,
        }

        if (this.contentType || this.auth) {
            options.headers = {};
            options.headers['Content-Type'] = this.contentType;
            options.headers['Authorization'] = this.auth;
        }

        return options;
    }
}