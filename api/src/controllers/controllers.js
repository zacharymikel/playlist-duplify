import * as apiController from "./api";
import AuthorizationController, * as authorizationController from "./authorization";
import * as playlistsController from "./playlists";

export default function(app, config) {
  const authorizationController = new AuthorizationController(
    config.clientId,
    config.clientSecret,
    config.redirectUri,
    config.scopes
  );

  app.get("/api", apiController.getApi);
  app.get("/authorize", authorizationController.getSignInUrl);
  app.get("/spotify-response", authorizationController.getAuthToken);
  app.get("/playlists", playlistsController.getPlaylists);
  app.post("/playlists/clone", playlistsController.clonePlaylist);
}
