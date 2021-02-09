import axios from 'axios'

// get请求
export function request(config, method='GET') {
    const instance = axios.create({
        baseURL: 'http://127.0.0.1:8888/api/private/v1/',
        timeout: 5000,
        method
    })

    // 请求参数拦截
    instance.interceptors.request.use(reqconfig => {
        return reqconfig
    }, err => {
        console.log(err);
    })

    // 服务器响应拦截
    instance.interceptors.response.use(res => {
        return res
    }, err => {
        console.log(err);
    })
    
    // 返回一个promise
    return instance(config)
}
