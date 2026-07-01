import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import LoginPage from '@/pages/auth/LoginPage.vue'
import CalibrationPage from '@/pages/calibration/CalibrationPage.vue'
import CertificatesPage from '@/pages/certificates/CertificatesPage.vue'
import DashboardPage from '@/pages/dashboard/DashboardPage.vue'
import DepartmentsPage from '@/pages/departments/DepartmentsPage.vue'
import EquipmentPage from '@/pages/equipment/EquipmentPage.vue'
import HospitalsPage from '@/pages/hospitals/HospitalsPage.vue'
import PreventiveMaintenancePage from '@/pages/preventive-maintenance/PreventiveMaintenancePage.vue'
import UsersPage from '@/pages/users/UsersPage.vue'
import WorkOrdersPage from '@/pages/work-orders/WorkOrdersPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'dashboard' },
  },
  {
    path: '/app',
    component: MainLayout,
    meta: { title: 'Application' },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardPage,
        meta: { title: 'Dashboard' },
      },
      {
        path: 'hospitals',
        name: 'hospitals',
        component: HospitalsPage,
        meta: { title: 'Hospitals' },
      },
      {
        path: 'departments',
        name: 'departments',
        component: DepartmentsPage,
        meta: { title: 'Departments' },
      },
      {
        path: 'equipment',
        name: 'equipment',
        component: EquipmentPage,
        meta: { title: 'Equipment' },
      },
      {
        path: 'work-orders',
        name: 'work-orders',
        component: WorkOrdersPage,
        meta: { title: 'Work Orders' },
      },
      {
        path: 'calibration',
        name: 'calibration',
        component: CalibrationPage,
        meta: { title: 'Calibration' },
      },
      {
        path: 'preventive-maintenance',
        name: 'preventive-maintenance',
        component: PreventiveMaintenancePage,
        meta: { title: 'Preventive Maintenance' },
      },
      {
        path: 'certificates',
        name: 'certificates',
        component: CertificatesPage,
        meta: { title: 'Certificates' },
      },
      {
        path: 'users',
        name: 'users',
        component: UsersPage,
        meta: { title: 'Users' },
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    meta: { title: 'Authentication' },
    children: [
      {
        path: 'login',
        name: 'login',
        component: LoginPage,
        meta: { title: 'Sign in' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'dashboard' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
