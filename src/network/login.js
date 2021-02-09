import { request } from './request'

export function loginData(username, password) {
    return request({
        url: '/login',
        params: {
            username,
            password
        }
    }, 'POST')
}