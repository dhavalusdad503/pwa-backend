import App from "./app";
import AuthRoute from "./features/auth/auth.routes";
import UserRoute from "./features/user/user.routes";
import VisitRoute from "./features/visit/visit.routes";
const appServer = new App([new UserRoute(), new AuthRoute(), new VisitRoute()]);

appServer.listen();

export default appServer;
