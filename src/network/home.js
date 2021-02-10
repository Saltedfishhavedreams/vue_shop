import { request } from './request'

export function getHomeData() {
  // 用于请求 侧边栏 菜单的数据
  return request({
    url: "/menus",
  })
}

export function getUserList(config) {
  // 用于获取用户列表数据
  return request(config)
}