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

export const saveLoginInfoAction = (value) => {
    // 将登录信息存储到本地
    localStorage.setItem(USER_ACCOUNT, JSON.stringify(value.account))
    localStorage.setItem(USER_PROFILE, JSON.stringify(value.profile))
    localStorage.setItem(USER_COOKIE, JSON.stringify(value.cookie))
    localStorage.setItem(USER_TOKEN, JSON.stringify(value.token))
    localStorage.setItem(USER_LOGINTYPE, JSON.stringify(value.loginType))
    localStorage.setItem(USER_ISLOGIN, JSON.stringify(true))
    return { type: SAVE_LOGIN_INFO, data: value }
}

export const deletLoginInfoAction = () => {
    // 从本地删除登录信息
    localStorage.setItem(USER_ACCOUNT, JSON.stringify({}))
    localStorage.setItem(USER_PROFILE, JSON.stringify({}))
    localStorage.setItem(USER_COOKIE, JSON.stringify(''))
    localStorage.setItem(USER_TOKEN, JSON.stringify(''))
    localStorage.setItem(USER_LOGINTYPE, JSON.stringify(-1))
    localStorage.setItem(USER_ISLOGIN, JSON.stringify(false))
    return { type: DELETE_LOGIN_INFO }
}

