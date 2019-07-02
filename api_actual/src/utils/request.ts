import request from 'request';

export class ApiResponse {
    data: any;
    error: any;
    message: any;
}

export class ApiRequest {

    baseUri: String;
    path: String;
    auth: String;
    contentType: String;

    constructor() {}

    withAuth(type: String, token: String): ApiRequest {
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

    post(data: any): Promise<ApiResponse> {    
        const options: any = this.getOptions(data);
        
        return new Promise<ApiResponse>((resolve, reject) => {
            request.post(options, (error: any, response: request.Response, body: any) => {
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

    getOptions(data: any): any {
        
        let options: any = {
            url: `${this.baseUri}${this.path}`
        }

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