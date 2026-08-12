export interface HospitalForm {
    hospitalNameTh: string,
    hospitalNameEn: string,
    abbreviation: string,
    address: string
}

export interface Hospital {
    id: string
    hospitalNameTh: string
    hospitalNameEn: string
    abbreviation: string
    address: string

    departments: number
    equipment: number
    workOrders: number

    status: 'Active' | 'Maintenance' | 'Inactive'
}
