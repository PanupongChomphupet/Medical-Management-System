export interface NavigationItem {
  label: string
  routeName: string
}

export const mainNavigationItems: NavigationItem[] = [
  { label: 'Dashboard', routeName: 'dashboard' },
  { label: 'Hospitals', routeName: 'hospitals' },
  { label: 'Users', routeName: 'users' },
  { label: 'Settings', routeName: 'settings' },
]
