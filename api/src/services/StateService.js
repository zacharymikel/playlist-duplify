import logger from '../utils/logger';
import config from '../utils/config';

const EXPIRATION_TIME = parseInt(config.getConfigValue('STATE_EXPIRATION'));
const SECRET = process.env.STATE_SECRET;

/**
 * This is a small in-memory generator that creates a base-64 encoded timestamp 
 * with a secret server-side value that we will use to keep track of client 
 * requests. 
 * 
 * When someone is signing into the Spotify API, we give Spotify a 
 * "secret code" to include in their response back to us with the client's 
 * auth token. This lets us know that this request came from Spotify and 
 * not someone trying to get our client's auth token. 
 * 
 */
class StateService {
    
    // Expiration time, value 
    states;
    secret;
    expirationPeriod;

    constructor(expiration, secret) {
        this.states = new Map();
        this.secret = secret;
        this.expirationPeriod = expiration;
    }
    
    // This is the secret code that we should send to spotify when someone is 
    // signing into their account. 
    generateNewState = () => {
        const currentTime = Date.now();

        const key = currentTime + this.expirationPeriod;
        const secret = process.env.STATE_SECRET;
        const state = Buffer.from(`${key}:${secret}`).toString('base64');
        this.states.set(key, state);
        setTimeout(() => { 
            this.states.delete(key); 
            const actualCleanupDateTime = new Date();
            logger.debug(`Cleaned up state={${key}:${state}} on ${actualCleanupDateTime}`);
        }, this.expirationPeriod);

        logger.debug(currentTime);
        logger.debug(this.expirationPeriod);
        const predictedCleanupDateTime = new Date(currentTime + this.expirationPeriod);
        logger.debug(`Generating a new state={${key}:${state}} that will timeout at ${predictedCleanupDateTime}`);
        return state;
    }

    // Let's verify that the person calling us really did previously call us, and 
    // we will use that in our request to Spotify for the auth token. 
    validateState = (state) => {
        const stateDecoded = new Buffer(state, 'base64').toString('ascii');
        const keyVal = stateDecoded.split(':');
        const key = parseInt(keyVal[0]);

        const stateIsValid = this.states.get(key) != null;
        logger.debug(`Client requested state ${state}, exists: ${stateIsValid}`);
        return stateIsValid; 
    }

}

const stateService = new StateService(EXPIRATION_TIME, SECRET);
export default stateService;