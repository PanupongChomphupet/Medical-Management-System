import type { WorkOrder } from "@/types/workorder";

export const workOrder: WorkOrder[] = [
    {
        id: '1',
        workOrderId: 'WO-2026-001',
        hospitalId: '1',
        startDate: '2023-01-01',
        endDate: '2023-01-10',
        staffIds: ['USERID1', 'USERID2', 'USERID3'],
        status: 'Pending',
        remark: '-',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
    },
    {
        id: '2',
        workOrderId: 'WO-2026-003',
        hospitalId: '2',
        startDate: '2023-01-20',
        endDate: '2023-01-25',
        staffIds: ['USERID2', 'USERID1'],
        status: 'In Progress',
        remark: '-',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
    }
]