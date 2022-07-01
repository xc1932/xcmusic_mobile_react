import request from './request'

// 1.获取每日推荐歌曲
// 说明 : 调用此接口 , 可获得每日推荐歌曲 ( 需要登录 )
// 接口地址 : /recommend/songs
// 调用例子 : /recommend/songs
export function getDailyRecommendTracks() {
    return request({
        url: '/recommend/songs',
        method: 'get',
    })
}

// 获取推荐歌单
// 说明 : 调用此接口 , 可获取推荐歌单
// 可选参数 : limit: 取出数量 , 默认为 30 (不支持 offset)
// 接口地址 : /personalized
// 调用例子 : /personalized?limit=1
export function getRecommendPlaylists() {
    return request({
        url: '/personalized',
        method: 'get',
    })
}

// 获取推荐 mv
// 说明 : 调用此接口 , 可获取推荐 mv
// 接口地址 : /personalized/mv
// 调用例子 : /personalized/mv
export function getRecommendMVs() {
    return request({
        url: '/personalized/mv',
        method: 'get',
    })
}