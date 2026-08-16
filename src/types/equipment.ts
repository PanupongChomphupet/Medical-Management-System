export interface Equipment {
    id: string
    assetNumber: string
    equipmentId : string
    equipmentName: string
    manufacturer: string
    model: string
    serialNumber: string
    workType: string
    riskLevel: string
    registeredBy : string
    remark: string
    status: string
    createdAt: string
    updatedAt: string
}
export interface EquipmentForm {
    assetNumber: string
    equipmentId : string
    equipmentName: string
    manufacturer: string
    model: string
    serialNumber: string
    workType: string
    riskLevel: string
    registeredBy : string
    remark: string
    status: string
}