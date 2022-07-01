import request from './request'

// 获取视频详情
// 说明 : 调用此接口 , 可获取视频详情
// 必选参数 : id: 视频 的 id
// 接口地址 : /video/detail
// 调用例子 : /video/detail?id=89ADDE33C0AAE8EC14B99F6750DB954D
export function getVideoDetail(params) {
    return request({
        url: '/video/detail',
        method: 'get',
        params
    })
}


// 获取视频播放地址
// 说明 : 调用此接口 , 传入视频 id,可获取视频播放地址
// 必选参数 : id: 视频 的 id
// 接口地址 : /video/url
// 调用例子 : /video/url?id=89ADDE33C0AAE8EC14B99F6750DB954D
export function getVideoUrl(params) {
    return request({
        url: '/video/detail',
        method: 'get',
        params
    })
}

// 获取视频点赞转发评论数数据
// 说明 : 调用此接口 , 传入 vid ( 视频 id ) , 可获取对应视频点赞转发评论数数据 必选参数 : vid: 视频 id
// 接口地址 : /video/detail/info
// 调用例子 : /video/detail/info?vid=89ADDE33C0AAE8EC14B99F6750DB954D
export function getVideoInfo(params) {
    return request({
        url: '/video/detail',
        method: 'get',
        params
    })
}