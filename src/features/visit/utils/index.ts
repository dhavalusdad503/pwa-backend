import { Patient, User } from "@models";


const visitFieldsMap = new Map([

  //visit model iteself
  ['id', { model: null, field: 'id' }],
  ['visitDate', { model: null, field: 'visitDate' }],
  ['serviceType', { model: null, field: 'serviceType' }],
  ['notes', { model: null, field: 'notes' }],
  ['startedAt', { model: null, field: 'startedAt' }],
  ['endedAt', { model: null, field: 'endedAt' }],
  ['submittedAt', { model: null, field: 'submittedAt' }],
  ['orgId', { model: null, field: 'orgId' }],
  ['patientId', { model: null, field: 'patientId' }],
  ['caregiverId', { model: null, field: 'caregiverId' }],
  
  // Patient association fields
  ['patientName', { model: Patient, field: 'name', association: 'patient' }],
  ['patientEmail', { model: Patient, field: 'email', association: 'patient' }],
  
  // Caregiver association fields  
  ['caregiverName', { model: User, field: ['firstName','lastName'], association: 'caregiver' }],
  ['caregiverPhone', { model: User, field: 'phone', association: 'caregiver'  }]
]);

export default visitFieldsMap;
