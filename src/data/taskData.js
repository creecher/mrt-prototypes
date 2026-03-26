export const TASK_DATA = [
  {
    id: 'TSK-001',
    task: 'Upload all referral documents into Chorus',
    taskType: 'Recup Referral Coordinator',
    dueDate: '2025-06-07',
    assignees: ['Jordan L.', 'Maria S.'],
    taskStatus: 'Not started',
  },
  {
    id: 'TSK-002',
    task: 'Gain health plan/other pay authorization',
    taskType: 'Recup Referral Coordinator',
    dueDate: '2025-06-10',
    assignees: ['Alex R.'],
    taskStatus: 'Not started',
  },
  {
    id: 'TSK-003',
    task: 'Gather and upload Referral Packet',
    taskType: 'Recup Referral Coordinator',
    dueDate: '2025-05-28',
    assignees: ['Jordan L.'],
    taskStatus: 'Not started',
  },
  {
    id: 'TSK-004',
    task: 'Initiate Intake Task Group in Chorus',
    taskType: 'Recup Referral Coordinator',
    dueDate: '2025-06-15',
    assignees: ['Sam T.', 'Jordan L.', 'Maria S.'],
    taskStatus: 'In progress',
  },
  {
    id: 'TSK-005',
    task: "Gather client's status, specific needs to assess eligibility for Revup",
    taskType: 'Recup Referral Coordinator',
    dueDate: '2025-06-02',
    assignees: ['Maria S.'],
    taskStatus: 'Not started',
  },
  {
    id: 'TSK-006',
    task: 'Complete initial assessment documentation',
    taskType: 'Recup Referral Coordinator',
    dueDate: '2025-05-20',
    assignees: ['Alex R.', 'Sam T.'],
    taskStatus: 'Not started',
  },
  {
    id: 'TSK-007',
    task: 'Schedule follow-up evaluation meeting',
    taskType: 'Recup Referral Coordinator',
    dueDate: '2025-06-18',
    assignees: ['Jordan L.'],
    taskStatus: 'Not started',
  },
  {
    id: 'TSK-008',
    task: 'Review and approve treatment plan',
    taskType: 'Recup Referral Coordinator',
    dueDate: '2025-06-12',
    assignees: ['Dana K.'],
    taskStatus: 'In progress',
  },
  {
    id: 'TSK-009',
    task: 'Verify insurance eligibility and benefits',
    taskType: 'Recup Referral Coordinator',
    dueDate: '2025-05-15',
    assignees: ['Maria S.', 'Dana K.'],
    taskStatus: 'In progress',
  },
  {
    id: 'TSK-010',
    task: 'Coordinate transportation arrangements',
    taskType: 'Recup Referral Coordinator',
    dueDate: '2025-06-08',
    assignees: ['Sam T.'],
    taskStatus: 'Not started',
  },
  {
    id: 'TSK-011',
    task: 'Obtain signed consent forms',
    taskType: 'Recup Referral Coordinator',
    dueDate: '2025-06-05',
    assignees: ['Alex R.'],
    taskStatus: 'In progress',
  },
  {
    id: 'TSK-012',
    task: 'Update client contact information',
    taskType: 'Recup Referral Coordinator',
    dueDate: '2025-06-20',
    assignees: ['Jordan L.', 'Alex R.'],
    taskStatus: 'Not started',
  },
  {
    id: 'TSK-013',
    task: 'Submit prior authorization request',
    taskType: 'Recup Referral Coordinator',
    dueDate: '2025-05-30',
    assignees: ['Dana K.'],
    taskStatus: 'Not started',
  },
  {
    id: 'TSK-014',
    task: 'Prepare discharge summary report',
    taskType: 'Recup Referral Coordinator',
    dueDate: '2025-06-25',
    assignees: ['Sam T.', 'Maria S.'],
    taskStatus: 'Not started',
  },
  {
    id: 'TSK-015',
    task: 'Follow up on missing lab results',
    taskType: 'Recup Referral Coordinator',
    dueDate: '2025-06-01',
    assignees: ['Alex R.'],
    taskStatus: 'In progress',
  },
]

export const STATUS_COLORS = {
  'Not started': 'var(--mui-palette-accent-crimson-10)',
  'In progress': 'var(--mui-palette-accent-blue-10)',
}

export const TASK_TYPE_CHIP_STYLES = {
  'Recup Referral Coordinator': {
    icon: 'fa-solid fa-file',
    bg: '#FFFAB8', // yellow-3
    color: '#8E6100', // yellow-11
    borderColor: 'var(--mui-palette-accent-yellow-6)',
  },
  'Intake Coordinator': {
    icon: 'fa-solid fa-clipboard-list',
    bg: '#E6F4FE',       // blue-3
    color: '#0469C1',    // blue-11
  },
  'Clinical Assessment': {
    icon: 'fa-solid fa-stethoscope',
    bg: '#E6F6EB',       // green-3
    color: '#15774C',    // green-11
  },
  'Treatment Planning': {
    icon: 'fa-solid fa-notes-medical',
    bg: '#F7EDFE',       // purple-3
    color: '#8145B5',    // purple-11
  },
}
