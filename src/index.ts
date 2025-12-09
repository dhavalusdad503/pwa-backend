import AuthRoute from "@features/auth/auth.routes";
import PatientRoute from "@features/patient/patient.routes";
import UserRoute from "@features/user/user.routes";
import VisitRoute from "@features/visit/visit.routes";
import App from "./app";

const appServer = new App([
  new UserRoute(),
  new AuthRoute(),
  new VisitRoute(),
  new PatientRoute(),
]);

appServer.listen();

export default appServer;
