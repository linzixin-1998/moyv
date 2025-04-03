/**
 * 应用状态
 */
export interface IAppState {
  menuList: IMenuItem[]
  activityMenu: IMenuItem | null
  [name: string]: any
}

export interface IMenuItem {
  icon: string
  name: string
  url: string
  activityIcon: string
  route: string
}
