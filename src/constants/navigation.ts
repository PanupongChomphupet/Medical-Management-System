export interface NavigationItem {
  label: string
  routeName: string
}

export const mainNavigationItems: NavigationItem[] = [
  { label: 'Dashboard', routeName: 'dashboard' },
  { label: 'Hospitals', routeName: 'hospitals' },
  { label: 'Users', routeName: 'users' },
  { label: 'Work Order', routeName: 'workorder' },
  { label: 'Settings', routeName: 'settings' },
]
