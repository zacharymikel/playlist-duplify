import request from "request";
import logger from "../utils/logger";

export class ApiResponse {
  data;
  error;
  status;
}

export class ApiRequest {
  baseUri;
  path;
  auth;
  contentType;
  object;

  constructor() {}

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

  get() {
    const options = this.getOptions(null);

    return new Promise((resolve, reject) => {
      request.get(
        options,
        (error, response, body) => {
          const result = this.constructResponse(response);
          result.status === 200 ? resolve(result) : reject(result);
        }
      );
    });
  }

  post(data) {
    const options = this.getOptions(data);

    return new Promise((resolve, reject) => {
      request.post(
        options,
        (error, response, body) => {
          const result = this.constructResponse(response);
          this.logResult(result);

          result.status === 200 ? resolve(result) : reject(result);
        }
      );
    });
  }

  parseRawResult = (raw) => {
    const result = {};
    for (let key in Object.keys(this.object)) {
      result[key] = raw[key];
    }

    return result;
  };

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

  constructResponse(response, error) {
    const result = new ApiResponse();
    const responseBody = response.body;
    result.status = response.statusCode;

    if (response.statusCode === 200) {
      result.data = JSON.parse(response.body);
    } else {
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
      form: data
    };

    if (this.contentType || this.auth) {
      options.headers = {};
      options.headers["Content-Type"] = this.contentType;
      options.headers["Authorization"] = this.auth;
    }

    return options;
  }
}
