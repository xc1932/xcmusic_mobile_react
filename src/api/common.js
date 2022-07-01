import request from './request'

// 1.获取轮播图数据 
// 说明 : 调用此接口 , 可获取 banner( 轮播图 ) 数据
// 可选参数 :
// type:资源类型,对应以下类型,默认为 0 即 PC
// 0: pc
// 1: android
// 2: iphone
// 3: ipad
// 接口地址 : /banner
// 调用例子 : /banner, /banner?type=2
export function getBanner(type) {
    const params = { type: 1 }
    if (type == null) {
        params['type'] = type
    }
    return request({
        url: '/banner',
        method: 'get',
        params
    })
}