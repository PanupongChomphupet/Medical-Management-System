export interface Hospital {
  id: string
  name: string
  code: string
  province: string
  departments: number
  equipment: number
  workOrders: number
  status: 'Active' | 'Maintenance' | 'Inactive'
}

export const hospitals: Hospital[] = [
  {
    id: 'bangkok-general',
    name: 'Bangkok General Hospital',
    code: 'BGH-001',
    province: 'Bangkok',
    departments: 18,
    equipment: 284,
    workOrders: 23,
    status: 'Active',
  },
  {
    id: 'chiangmai-medical-center',
    name: 'Chiang Mai Medical Center',
    code: 'CMC-014',
    province: 'Chiang Mai',
    departments: 12,
    equipment: 172,
    workOrders: 11,
    status: 'Active',
  },
  {
    id: 'khon-kaen-regional',
    name: 'Khon Kaen Regional Hospital',
    code: 'KKR-022',
    province: 'Khon Kaen',
    departments: 15,
    equipment: 219,
    workOrders: 18,
    status: 'Maintenance',
  },
  {
    id: 'songkhla-care',
    name: 'Songkhla Care Hospital',
    code: 'SCH-037',
    province: 'Songkhla',
    departments: 9,
    equipment: 136,
    workOrders: 7,
    status: 'Active',
  },
]
