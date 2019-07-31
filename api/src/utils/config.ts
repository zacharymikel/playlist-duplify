import spotifyConfig from "../config/spotify.config";
import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

const path = fs.realpathSync("./");

if (fs.existsSync(".env")) {
  logger.debug("Using .env file to supply config environment variables");
  dotenv.config({ path: ".env" });
} else {
  logger.debug(
    "Using .env.example file to supply config environment variables"
  );
  dotenv.config({ path: ".env.example" }); // you can delete this after you create your own .env file!
}

// Load Configuration
export const loadConfig = (): any => {
  return {
    environment: process.env.NODE_ENV,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    stateSecret: process.env.STATE_SECRET,
    stateExpiration: process.env.STATE_EXPIRATION,
    scopes: spotifyConfig.scopes
  };
};

export const getConfigValue = (value: string): string => {
  return process.env[value] || null;
};
