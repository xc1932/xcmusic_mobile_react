import request from './request'

// 获取专辑内容
// 说明 : 调用此接口 , 传入专辑 id, 可获得专辑内容
// 必选参数 : id: 专辑 id
// 接口地址 : /album
// 调用例子 : /album?id=32311
export function getAlbumDetail(params) {
    return request({
        url: '/album',
        method: 'get',
        params
    })
}

// 获取专辑动态信息
// 说明 : 调用此接口 , 传入专辑 id, 可获得专辑动态信息,如是否收藏,收藏数,评论数,分享数
// 必选参数 : id: 专辑 id
// 接口地址 : /album/detail/dynamic
// 调用例子 : /album/detail/dynamic?id=32311
export function getAlbumDynamicDetail(params) {
    return request({
        url: '/album/detail/dynamic',
        method: 'get',
        params
    })
}

// 获取新碟上架
// 说明 : 调用此接口 , 可获取新碟上架列表 , 如需具体音乐信息需要调用获取专辑列表接 口 /album , 然后传入 id, 如 /album?id=32311&limit=30
// 可选参数 :
// limit: 取出数量 , 默认为 50
// offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认 为 0
// area: ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本
// type : new:全部 hot:热门,默认为 new
// year : 年,默认本年
// month : 月,默认本月
// 接口地址 : /top/album
// 调用例子 : /top/album?offset=0&limit=30&year=2019&month=6
export function getOnNewDisc(params) {
    return request({
        url: '/top/album',
        method: 'get',
        params
    })
}

// 获取全部新碟
// 说明 : 登录后调用此接口 ,可获取全部新碟
// 可选参数 :
// limit : 返回数量 , 默认为 30
// offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
// area : ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本
// 接口地址 : /album/new
// 调用例子 : /album/new?area=KR&limit=10
export function getNewDisc(params) {
    return request({
        url: '/album/new',
        method: 'get',
        params
    })
}

// 获取最新专辑
// 说明 : 调用此接口 ，获取云音乐首页新碟上架数据
// 接口地址 : /album/newest
// 调用例子 : /album/newest
export function getNewAlbums(params) {
    return request({
        url: '/album/newest',
        method: 'get',
    })
}

