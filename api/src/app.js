import express from 'express';
import compression from "compression"; // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";
import * as configService from "./utils/config";
import loadControllers from "./controllers/controllers";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

// Load configuration
const config = configService.loadConfig();

// Load API Routes
loadControllers(app, config);

// Load Services
require("./services/StateService");

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});

export default app;
