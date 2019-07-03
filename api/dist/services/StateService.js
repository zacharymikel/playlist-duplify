"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const EXPIRATION_TIME = parseInt(process.env.STATE_EXPIRATION);
const SECRET = process.env.STATE_SECRET;
class StateService {
    constructor(expiration, secret) {
        this.generateNewState = () => {
            const currentTime = Date.now();
            const key = currentTime + this.expirationPeriod;
            const secret = process.env.STATE_SECRET;
            const state = Buffer.from(`${key}:${secret}`).toString('base64');
            this.states.set(key, state);
            setTimeout(() => {
                this.states.delete(key);
                logger_1.default.debug("Cleaning up state key: " + key);
            }, this.expirationPeriod);
            return state;
        };
        this.validateState = (state) => {
            const stateDecoded = new Buffer(state, 'base64').toString('ascii');
            const keyVal = stateDecoded.split(':');
            const key = parseInt(keyVal[0]);
            return this.states.get(key) != null;
        };
        this.states = new Map();
        this.secret = secret;
        this.expirationPeriod = expiration;
    }
}
const stateService = new StateService(EXPIRATION_TIME, SECRET);
exports.default = stateService;
//# sourceMappingURL=StateService.js.map