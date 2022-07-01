import axios from 'axios'
import appConfig from '@/app-config.json'
import { Toast } from 'antd-mobile'

// 创建实例时配置默认值
const service = axios.create({
    baseURL: appConfig.baseURL,
    // 跨域请求时是否需要使用凭证
    withCredentials: true,
    // 请求超时的毫秒数
    timeout: 15000,
})

// 添加请求拦截器
service.interceptors.request.use(config => {
    return config
})

// 添加响应拦截器
service.interceptors.response.use(response => {
    return response.data
}, error => {
    console.log(error);
    const response = error.response
    const data = response?.data
    if (response && typeof data === 'object') {
        // 业务逻辑错误
        if (data.code === 301 && data.msg === '需要登录') {
            // 未登录或登录过期处理
            // 1.跳转到登录页面
            window.location.href = '/login'
            // 2.登出处理

        } else if (data.code === 503 && data.message === '验证码错误') {
            Toast.show({
                content: data.message,
                maskClickable: false
            })
        }
        else {
            // 统一处理(验证码错误)
            Toast.show({
                content: 'Unknown Error: ' + data.msg,
                maskClickable: false
            })
        }
    } else {
        // 底层错误统一处理(网络错误)
        Toast.show({
            content: 'Inner Error: ' + error.message,
            maskClickable: false
        })
    }
    console.log('error:', error);
    // 中断promise
    return Promise.reject('Error appered!')
})

export default service