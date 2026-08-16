export interface Hospital {
    id: string
    hospitalNameTh: string
    hospitalNameEn: string
    abbreviation: string
    address: string
    status: 'Active' | 'Maintenance' | 'Inactive'
    createdAt: string
    updatedAt: string
}
export interface HospitalForm {
    hospitalNameTh: string,
    hospitalNameEn: string,
    abbreviation: string,
    address: string
    createdAt: string,
}


