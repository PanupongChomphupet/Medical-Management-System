export interface NavigationItem {
  label: string
  routeName: string
}

export const mainNavigationItems: NavigationItem[] = [
  { label: 'Dashboard', routeName: 'dashboard' },
  { label: 'Hospitals', routeName: 'hospitals' },
  { label: 'Departments', routeName: 'departments' },
  { label: 'Equipment', routeName: 'equipment' },
  { label: 'Work Orders', routeName: 'work-orders' },
  { label: 'Calibration', routeName: 'calibration' },
  { label: 'Preventive Maintenance', routeName: 'preventive-maintenance' },
  { label: 'Certificates', routeName: 'certificates' },
  { label: 'Users', routeName: 'users' },
]
