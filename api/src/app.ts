// Load .env onto process
require('./utils/secrets');

import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import path from "path";
import lusca from "lusca";
import loadControllers from './controllers/controllers';

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

// Load API Routes
loadControllers(app);

// Load Services
require('./services/StateService');

export default app;
