import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import path from "path";
import lusca from "lusca";

// Load .env onto process
require('./utils/secrets');

// Controllers (route handlers)
import * as apiController from "./controllers/api";
import * as authorizationController from "./controllers/authorization";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

/**
 * API examples routes.
 */
app.get("/api", apiController.getApi);
app.get("/authorize", authorizationController.getSignInUrl);
app.get("/spotify-response", authorizationController.getAuthToken);

export default app;
