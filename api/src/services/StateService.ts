import logger from '../utils/logger';

const EXPIRATION_TIME = parseInt(process.env.STATE_EXPIRATION);
const SECRET = process.env.STATE_SECRET;

class StateService {
    
    // Expiration time, value 
    states: Map<number, string>;
    secret: String;
    expirationPeriod: number;

    constructor(expiration: number, secret: String) {
        this.states = new Map();
        this.secret = secret;
        this.expirationPeriod = expiration;
    }
    
    generateNewState = (): String => {
        const currentTime = Date.now();

        const key = currentTime + this.expirationPeriod;
        const secret = process.env.STATE_SECRET;
        const state = Buffer.from(`${key}:${secret}`).toString('base64');
        this.states.set(key, state);
        setTimeout(() => { 
            this.states.delete(key); 
            logger.debug("Cleaning up state key: " + key);
        }, this.expirationPeriod);

        return state;
    }

    validateState = (state: string): boolean => {
        const stateDecoded = new Buffer(state, 'base64').toString('ascii');
        const keyVal = stateDecoded.split(':');
        const key = parseInt(keyVal[0]);

        return this.states.get(key) != null;
    }

}

const stateService = new StateService(EXPIRATION_TIME, SECRET);
export default stateService;