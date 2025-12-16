import { OrgUser } from "@modules/org-user/entities/org-user.entity";
import { Role } from "@modules/roles/entities/role.entity";


const usersFieldsMap = new Map([

  //user model itself
  ['id', { model: null, field: 'id' }],
  ['name', { model: null, field: ['firstName', 'lastName'] }],
  ['firstName', { model: null, field: 'firstName' }],
  ['lastName', { model: null, field: 'lastName' }],
  ['email', { model: null, field: 'email' }],
  ['phone', { model: null, field: 'phone' }],
  ['createdAt', { model: null, field: 'createdAt' }],
  ['updatedAt', { model: null, field: 'updatedAt' }],

  //User Orgs association
  ['userOrgs', { model: OrgUser, field: ['orgId'], association: 'userOrgs' }],

  //Role association
  ['role', { model: Role, field: ['slug'], association: 'role' }],
])

export default usersFieldsMap;

