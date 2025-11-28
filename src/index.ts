
import App from "./app";
import UserRoute from "./features/user/user.routes";
import AuthRoute from "./features/auth/auth.routes";

const appServer = new App([
    new UserRoute(),
    new AuthRoute(),
]);

appServer.listen();

export default appServer;