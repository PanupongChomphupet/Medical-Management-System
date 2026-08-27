export interface WorkOrder {
    id: string
    workOrderId: string
    hospitalId: string
    startDate: string
    endDate: string
    staffIds: string[]
    status: 'Pending' | 'In Progress' | 'Completed'
    remark: string
    createdAt: string
    updatedAt: string
}

export interface WorkOrderForm {
    hospitalId: string
    startDate: string
    endDate: string
    staffIds: string[]
    status: 'Pending' | 'In Progress' | 'Completed'
    remark: string
}

export interface WorkOrderEquipmentType {
    id: string
    workOrderId: string
    equipmentId: string
    jobType: 'CAL' | 'PM' | 'CAL/PM'
    status: 'Pending' | 'In Progress' | 'Completed'
}
