import axios from 'axios'

// get请求
export function request(config,) {
    // Authorization 为布尔值
    const instance = axios.create({
        baseURL: 'http://127.0.0.1:8888/api/private/v1/',
        timeout: 5000,
    })

    // 请求参数拦截
    instance.interceptors.request.use(reqconfig => {
        // 请求服务器的数据需要token作为身份认证
        reqconfig.headers.Authorization = window.sessionStorage.getItem('token')
        return reqconfig
    }, err => {
        console.log(err);
    })

    // 服务器响应拦截
    instance.interceptors.response.use(resconfig => {
        return resconfig
    }, err => {
        console.log(err);
    })
    
    // 返回一个promise
    return instance(config)
}
