export interface Department {
    id: string
    hospitalId: string
    departmentCode: string
    departmentName: string
    createdAt: string
    updatedAt: string
}
export interface DepartmentForm {
    departmentName: string
    departmentCode: string
}