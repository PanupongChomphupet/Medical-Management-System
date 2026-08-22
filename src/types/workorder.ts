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
