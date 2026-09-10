export interface Hospital {
    id: string
    hospitalNameTh: string
    hospitalNameEn: string
    initial: string /* ตัวย่อโรงพยาบาล */

    address: string
    subdistrict: string
    district: string
    province: string
    postalCode: string

    status: 'Active' | 'Inactive'
    createdAt: string
    updatedAt: string
}
export interface HospitalForm {
    hospitalNameTh: string
    hospitalNameEn: string
    initial: string

    address: string
    subdistrict: string
    district: string
    province: string
    postalCode: string

    status: 'Active' | 'Inactive'
}