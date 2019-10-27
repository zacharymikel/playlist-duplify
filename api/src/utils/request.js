import request from "request";
import logger from "../utils/logger";

export class ApiResponse {
  data;
  error;
  status;

  ok() {
    return this.status === 200 || this.status === 201; 
  }
}

export class ApiRequest {
  baseUri;
  path;
  auth;
  contentType;
  object;
  debug = false;

  constructor(debug) {
    if(debug) {
      this.debug = true; 
    }
  }

  withAuth(token, type) {
    this.auth = type + " " + token;
    return this;
  }

  withBaseUri(uri) {
    this.baseUri = uri;
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

  get({ path, contentType }) {
    // Build request body and headers for this HTTP request 
    let options = {
      url: `${this.baseUri}${path}`,
    };

    options.headers = {};
    options.headers["Content-Type"] = contentType || this.contentType;
    if (this.auth) {
      options.headers["Authorization"] = this.auth;
    }

    return new Promise((resolve, reject) => {
      request.get(
        options,
        (error, response, body) => {
          const result = this.parseHttpResponse({ error, response });
          if(this.debug) {
            this.logResult(result);
          }
          result.ok() ? resolve(result) : reject(result);
        }
      );
    });
  }

  post({ path, formData, contentType }) {

    // Build request body and headers for this HTTP request 
    let options = {
      url: `${this.baseUri}${path}`,
      form: JSON.stringify(formData)
    };

    options.headers = {};
    options.headers["Content-Type"] = contentType || this.contentType;
    if (this.auth) {
      options.headers["Authorization"] = this.auth;
    }

    // Use Request JS to make the HTTP request 
    return new Promise((resolve, reject) => {
      request.post(
        options,
        (error, response) => {

          // Take the response from Request JS and populate 
          // the data in our ApiResponse object along with 
          // any status codes or errors. 
          const result = this.parseHttpResponse({ response, error });
          if(this.debug) {
            this.logResult(result);
          }
          result.ok() ? resolve(result) : reject(result);
        }
      );
    });
  }

  parseHttpResponse({ response, error }) {
    const result = new ApiResponse();
    const responseBody = response.body;
    result.status = response.statusCode;

    if (result.ok()) {
      result.data = JSON.parse(response.body);
    } else {
      result.error = error || responseBody;
    }
    return result;
  }

  logResult(result) {
    logger.debug(
      `API Request for ${this.buildPath()} completed with status ${
        result.status
      }`
    );
    if (result.status !== 200) {
      logger.debug(`${JSON.stringify(result.data)}`);
      logger.debug(`${JSON.stringify(result.error)}`);
    }
  }

  buildPath() {
    return `${this.baseUri}${this.path}`;
  }

  parseResponse(response) {
    return response.body ? JSON.parse(response.body) : {};
  }
}
