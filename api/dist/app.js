"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load .env onto process
require('./utils/secrets');
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression")); // compresses requests
const body_parser_1 = __importDefault(require("body-parser"));
const lusca_1 = __importDefault(require("lusca"));
const controllers_1 = __importDefault(require("./controllers/controllers"));
// Create Express server
const app = express_1.default();
// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(compression_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(lusca_1.default.xframe("SAMEORIGIN"));
app.use(lusca_1.default.xssProtection(true));
// Load API Routes
controllers_1.default(app);
// Load Services
require('./services/StateService');
exports.default = app;
//# sourceMappingURL=app.js.map