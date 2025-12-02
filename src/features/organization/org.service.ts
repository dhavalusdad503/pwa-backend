import orgRepository from "@features/organization/org.repository";

class OrgService {
  private orgRepository: typeof orgRepository;

  constructor() {
    this.orgRepository = orgRepository;
  }

  //   async getAllVisits(id: string | number): Promise<Organization[]> {
  //     return await this.orgRepository.findAll({ where: { caregiverId: id } });
  //   }
}
export default new OrgService();
