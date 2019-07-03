import * as apiController from './api';
import * as authorizationController from './authorization';
import * as profileController from './profile';

export default function(app: any) {
    app.get("/api", apiController.getApi);
    app.get("/authorize", authorizationController.getSignInUrl);
    app.get("/spotify-response", authorizationController.getAuthToken);
    app.get("/spotify-profile", profileController.getProfile);
}