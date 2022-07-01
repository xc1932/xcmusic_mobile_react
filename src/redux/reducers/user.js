import {
    SAVE_LOGIN_INFO,
    DELETE_LOGIN_INFO,
    USER_ACCOUNT,
    USER_PROFILE,
    USER_COOKIE,
    USER_TOKEN,
    USER_LOGINTYPE,
    USER_ISLOGIN,
} from '../constant'

// 从localStorage中获取登录信息
const account = JSON.parse(localStorage.getItem(USER_ACCOUNT))
const profile = JSON.parse(localStorage.getItem(USER_PROFILE))
const cookie = JSON.parse(localStorage.getItem(USER_COOKIE))
const token = JSON.parse(localStorage.getItem(USER_TOKEN))
const loginType = JSON.parse(localStorage.getItem(USER_LOGINTYPE))
const isLogin = JSON.parse(localStorage.getItem(USER_ISLOGIN))

const initState = {
    account: account || {},     //账户信息
    profile: profile || {},     //用户简介
    cookie: cookie || '',
    token: token || '',
    loginType: loginType || -1,  //登录方式 0: 邮箱 1:验证码
    isLogin: isLogin || false,
    likedMVs: ['123']
}
export default function userReducer(preState = initState, action) {
    const { type, data } = action
    switch (type) {
        // 保存login信息
        case SAVE_LOGIN_INFO:
            return {
                ...preState,
                account: data.account,
                profile: data.profile,
                cookie: data.cookie,
                token: data.token,
                loginType: data.loginType,
                isLogin: true
            }
        // 删除登录信息
        case DELETE_LOGIN_INFO:
            return {
                ...preState,
                account: {},
                profile: {},
                cookie: '',
                token: '',
                loginType: -1,
                isLogin: false
            }
        default:
            return preState
    }
}