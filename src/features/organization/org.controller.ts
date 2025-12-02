class OrgController {
  //   async getAll(req: AuthRequest, res: Response): Promise<Response> {
  //     try {
  //       const { id } = req.user;
  //       const visits = await OrgService.getAllOrganization(id);
  //       return successResponse(res, visits, "Visit fetch successfully");
  //     } catch (error) {
  //       logger.error("Error fetching visits:", error);
  //       return res.status(500).json({ message: "Internal server error" });
  //     }
  //   }
}

export default new OrgController();
