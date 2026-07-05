import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import LoginPage from '@/pages/auth/LoginPage.vue'
import DashboardPage from '@/pages/dashboard/DashboardPage.vue'
import HospitalCertificatesTab from '@/pages/hospitals/tabs/HospitalCertificatesTab.vue'
import HospitalDepartmentsTab from '@/pages/hospitals/tabs/HospitalDepartmentsTab.vue'
import HospitalDetailPage from '@/pages/hospitals/HospitalDetailPage.vue'
import HospitalEquipmentTab from '@/pages/hospitals/tabs/HospitalEquipmentTab.vue'
import HospitalOverviewTab from '@/pages/hospitals/tabs/HospitalOverviewTab.vue'
import HospitalReportsTab from '@/pages/hospitals/tabs/HospitalReportsTab.vue'
import HospitalWorkOrdersTab from '@/pages/hospitals/tabs/HospitalWorkOrdersTab.vue'
import HospitalsPage from '@/pages/hospitals/HospitalsPage.vue'
import SettingsPage from '@/pages/settings/SettingsPage.vue'
import UsersPage from '@/pages/users/UsersPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'dashboard' },
  },
  {
    path: '/',
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
        path: 'hospitals/:id',
        component: HospitalDetailPage,
        meta: { title: 'Hospital Detail' },
        children: [
          {
            path: '',
            redirect: (to) => ({
              name: 'hospital-overview',
              params: to.params,
            }),
          },
          {
            path: 'overview',
            name: 'hospital-overview',
            component: HospitalOverviewTab,
            meta: { title: 'Overview' },
          },
          {
            path: 'departments',
            name: 'hospital-departments',
            component: HospitalDepartmentsTab,
            meta: { title: 'Departments' },
          },
          {
            path: 'equipment',
            name: 'hospital-equipment',
            component: HospitalEquipmentTab,
            meta: { title: 'Equipment' },
          },
          {
            path: 'work-orders',
            name: 'hospital-work-orders',
            component: HospitalWorkOrdersTab,
            meta: { title: 'Work Orders' },
          },
          {
            path: 'reports',
            name: 'hospital-reports',
            component: HospitalReportsTab,
            meta: { title: 'Reports' },
          },
          {
            path: 'certificates',
            name: 'hospital-certificates',
            component: HospitalCertificatesTab,
            meta: { title: 'Certificates' },
          },
        ],
      },
      {
        path: 'users',
        name: 'users',
        component: UsersPage,
        meta: { title: 'Users' },
      },
      {
        path: 'settings',
        name: 'settings',
        component: SettingsPage,
        meta: { title: 'Settings' },
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
