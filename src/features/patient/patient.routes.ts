import patientController from "@features/patient/patient.controller";
import { asyncHandler } from "@helper";
import { verifyJWTToken } from "@middlewares/auth.middleware";
import { BaseRoute } from "@routes/base.routes";

export default class PatientRoute extends BaseRoute {
  constructor() {
    super("/patient");
  }

  protected initializeRoutes(): void {
    this.router.use(verifyJWTToken);

    this.router.get("/", asyncHandler(patientController.getAll));
    // this.router.get("/:id", asyncHandler(visitController.getById));
    // this.router.put("/:id", validationMiddleware(updateVisitSchema), asyncHandler(visitController.update));
    // this.router.delete("/:id",  asyncHandler(visitController.delete));
    // this.router.get("/organization/:orgId",  asyncHandler(visitController.getByOrganization));
    // this.router.get("/caregiver/:caregiverId",  asyncHandler(visitController.getByCaregiver));
    // this.router.get("/patient/:patientId", asyncHandler(visitController.getByPatient));
  }
}
