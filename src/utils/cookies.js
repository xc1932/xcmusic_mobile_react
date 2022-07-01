import Cookies from 'js-cookie'

// 设置cookie
// ?并将cookie存储在localStorage中
export function setCookies(cookieString) {
    const cookies = cookieString.split(';;')
    cookies.forEach(cookie => {
        document.cookie = cookie
        // const cookieKeyValue = cookie.split(';')[0].split('=');
        // localStorage.setItem(`User_Cookie_${cookieKeyValue[0]}`, cookieKeyValue[1]);
    })
}

// 从document.cookie中或localStorage中获取cookie
export function getCookie(key) {
    return Cookies.get(key) ?? localStorage.getItem(`User_Cookie_${key}`);
}

// 从document.cookie中或localStorage中移除cookie
export function removeCookie(key) {
    Cookies.remove(key);
    localStorage.removeItem(`User_Cookie_${key}`);
}