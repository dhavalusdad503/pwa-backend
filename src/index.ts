
import App from "./app";
import UserRoute from "./features/user/user.routes";

const appServer = new App([
    new UserRoute(),
]);

appServer.listen();

export default appServer;