import request from './request'

// 1.邮箱+密码登录
// 必选参数 :
// email:    163 网易邮箱
// password: 密码
// 可选参数 :
// md5_password: md5 加密后的密码,传入后 password 将失效
// 接口地址 : /login
// 调用例子 : /login?email=xxx@163.com&password=yyy
// 完成登录后 , 会在浏览器保存一个 Cookies 用作登录凭证 , 大部分 API 都需要用到这个 Cookies,
// 非跨域情况请求会自动带上 Cookies,跨域情况参考调用前须知。
// v3.30.0 后支持手动传入 cookie,登录接口返回内容新增 cookie 字段,保存到本地后,get 请求带上
// ?cookie=xxx (先使用 encodeURIComponent() 编码 cookie 值) 或者 post 请求 body 带上 cookie 
// 即可,如:/user/cloud?cookie=xxx 或者
// {
//     ...,
//     cookie:"xxx"
// }
export function loginWithEmail(params) {
    return request({
        url: '/login',
        method: 'post',
        params
    })
}

// 2.手机+密码登录 or 手机+验证码登录
// 必选参数 :
// phone: 手机号码
// password: 密码
// 可选参数 :
// countrycode:  国家码，用于国外手机号登录，例如美国传入：1
// md5_password: md5 加密后的密码,传入后 password 参数将失效
// captcha:      验证码,使用 /captcha/sent接口传入手机号获取验证码,
//               调用此接口传入验证码,可使用验证码登录,传入后 password 参数将失效
// 接口地址 : /login/cellphone
// 调用例子 : /login/cellphone?phone=xxx&password=yyy 
//           /login/cellphone?phone=xxx&md5_password=yyy 
//           /login/cellphone?phone=xxx&captcha=1234
export function loginWithPhone(params) {
    return request({
        url: '/login/cellphone',
        method: 'post',
        params
    })
}

// 2.1发送验证码
// 说明 : 调用此接口 ,传入手机号码, 可发送验证码
// 必选参数 : phone:  手机号码
// 可选参数 : ctcode: 国家区号,默认 86 即中国
// 接口地址 : /captcha/sent
// 调用例子 : /captcha/sent?phone=13xxx
export function sendCaptcha(params) {
    return request({
        url: '/captcha/sent',
        method: 'post',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 2.2验证验证码
// 说明 : 调用此接口 ,传入手机号码和验证码, 可校验验证码是否正确
// 必选参数 : 
// phone:   手机号码
// captcha: 验证码
// 可选参数 :
// ctcode: 国家区号,默认 86 即中国
// 接口地址 : /captcha/verify
// 调用例子 : /captcha/verify?phone=13xxx&captcha=1597
export function verifyCaptcha(params) {
    return request({
        url: '/captcha/verify',
        method: 'post',
        params: {
            ...params,
            timestamp: new Date().getTime()
        }
    })
}

// 3.退出登录
// 说明 : 调用此接口 , 可退出登录
// 调用例子 : /logout
export function logout() {
    return request({
        url: '/logout',
        method: 'post',
    })
}

// 4.获取登录状态
// 说明 : 调用此接口,可获取登录状态
// 接口地址 : /login/status
export function getLoginStatus() {
    return request({
        url: '/login/status',
        method: 'post',
    })
}